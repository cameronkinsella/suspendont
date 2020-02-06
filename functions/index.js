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

  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.storeNames(config, { user_id: req.body.user_id })
    .then((data) => {
      //console.log(req.body.stored_data)
      const docRef = db.collection('users').doc(req.body.user_id);
      const getDoc = docRef.get()
        .then((doc) => {
          if (!doc.exists) {
            const setData = docRef.set({
              screen_name: data.screen_name,
              profile_pic: data.profile_pic,
              user_id: data.user_id
            });
          } else {
            friends.suspensionCheck(config, { storedData: doc.data(), newData: data })
              .then((data) => {
                res.json(qs.parse(data));
                const setData = docRef.set({
                  screen_name: data.screen_name,
                  profile_pic: data.profile_pic,
                  user_id: data.user_id
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
