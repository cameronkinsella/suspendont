const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const OAuth = require('oauth-1.0a');
const qs = require('qs');
const HmacSHA1 = require('crypto-js/hmac-sha1');
const Base64 = require('crypto-js/enc-base64');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const friends = require('./twitter');
const keys = require('./keys');


admin.initializeApp({
  credential: admin.credential.cert(keys.serviceAccount),
  databaseURL: keys.databaseURL
});

let db = admin.firestore();

const app = express();

const config = {
  TWITTER: {
    CLIENT_ID: keys.consumer_key,
    CLIENT_SECRET: keys.consumer_secret,
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/auth/request_token', async (req, res) => {

  /*
  Required Request Params:
  redirect_uri

  Description:
  Step 1 for receiving user access token through 3-legged OAuth. See here for details:
  https://developer.twitter.com/en/docs/basics/authentication/oauth-1-0a/obtaining-user-access-tokens
   */

  const { redirect_uri } = req.body;

  const oauth = OAuth({
    consumer: {
      key: config.TWITTER.CLIENT_ID,
      secret: config.TWITTER.CLIENT_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => Base64.stringify(HmacSHA1(baseString, key))
  });

  const request_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: {
      oauth_callback: redirect_uri,
    }
  };

  const response = await fetch(request_data.url, {
    method: request_data.method,
    headers: oauth.toHeader(oauth.authorize(request_data))
  });

  const text = await response.text();
  return res.json(qs.parse(text))
});


app.post('/auth/access_token', async (req, res) => {

  /*
  Required Request Params:
  redirect_uri

  Description:
  Step 3 for receiving user access token through 3-legged OAuth. See here for details:
  https://developer.twitter.com/en/docs/basics/authentication/oauth-1-0a/obtaining-user-access-tokens
 */

  const { oauth_token, oauth_token_secret, oauth_verifier } = req.body;

  const oauth = OAuth({
    consumer: {
      key: config.TWITTER.CLIENT_ID,
      secret: config.TWITTER.CLIENT_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => Base64.stringify(HmacSHA1(baseString, key))
  });

  const request_data = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
    data: {
      oauth_verifier,
    },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data, { key: oauth_token, secret: oauth_token_secret }));

  const response = await fetch(request_data.url, {
    method: request_data.method,
    data: request_data.data,
    headers
  });

  if (response.status !== 200) {
    res.status = response.status;
    return res.json({ message: "something wrong" })
  }
  const text = await response.text();
  return res.json(qs.parse(text))
});


app.post('/auth/verify', (req, res) => {

  /*
  Required Request Params:
  token, token_secret

  Description:
  Used to verify that the user's token is still valid. If successful, returns several user details.
   */

  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.verifyUser(config)
    .then((data) => {
      res.json(qs.parse(data))
    })
    .catch((err) => {
      res.send(err);
      console.log(err)
    })
});

app.post('/auth/invalidate_token', (req, res) => {

  /*
  Required Request Params:
  token, token_secret

  Description:
  Used to invalidate a user's token when requested.
   */

  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.invalidateToken(config)
    .then((data) => {
      res.json({ statusCode: data.resp.statusCode })
    })
    .catch((err) => {
      res.send(err);
      console.log(err)
    })
});

app.post('/twitter/suspended', (req, res) => {

  /*
  Required Request Params:
  user_id, token, token_secret

  Description:
  Accesses stored friends. If no stored friends exist, the user's friends are stored and the following is skipped.
  An updated list of friends is retrieved and compared to the stored list. Any friends no longer present are
  checked to see if they are suspended or deleted. The list of suspended and list of deleted friends are returned,
  or null if nobody was suspended. The stored friends list is updated and any new suspended/deleted users are appended
  to the user's doc in the db.
   */

  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.storeNames(config, { user_id: req.body.user_id })
    .then((data) => {
      //console.log(req.body.stored_data)
      const userDocRef = db.collection('users').doc(req.body.user_id);
      const suspendedDocRef = db.collection('suspended').doc(req.body.user_id);

      const getDoc = userDocRef.get()
        .then((doc) => {
          if (!doc.exists) {
            const setData = userDocRef.set({
              screen_name: data.screen_name,
              profile_pic: data.profile_pic,
              user_id: data.user_id
            });
          } else {
            friends.suspensionCheck(config, { storedData: doc.data(), newData: data })
              .then((suspendedData) => {
                res.json(qs.parse(suspendedData));
                const setData = userDocRef.set({
                  screen_name: data.screen_name,
                  profile_pic: data.profile_pic,
                  user_id: data.user_id
                });
                const setSuspendedDoc = suspendedDocRef.get()
                  .then((doc) => {
                    if (!doc.exists) {
                      const setData = suspendedDocRef.arrayUnion({
                        suspendedUsers: suspendedData.suspendedUsers,
                        deletedUsers: suspendedData.deletedUsers
                      })
                    } else {
                      const updateSuspendedDoc = suspendedDocRef.update({
                        suspendedUsers: db.FieldValue.arrayUnion(suspendedData.suspendedUsers),
                        deletedUsers: db.FieldValue.arrayUnion(suspendedData.deletedUsers)
                      })
                    }
                  });
              })
              .catch((err) => {
                res.json(err)
              });
          }
        })
        .catch((err) => {
          res.send(qs.parse(err));
          console.log(err)
        });
    }).catch((err) => {
    console.log(err)
  })
});

exports.app = functions.https.onRequest(app);


/*
app.post('/twitter/names', (req, res) => {

  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.storeNames(config, { screen_name: req.body.screen_name })
    .then((data) => {

      const docRef = db.collection('users').doc(req.body.screen_name);

      const setData = docRef.set({
        screen_name: data.screen_name,
        profile_pic: data.profile_pic,
        user_id: data.user_id
      });

      db.collection('users').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
          });
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });


      res.json(qs.parse(data))
    })
    .catch((err) => {
      res.send(err);
      console.log(err)
    });
});
*/
