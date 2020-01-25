const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const OAuth = require('oauth-1.0a');
const qs = require('qs');
const HmacSHA1 = require('crypto-js/hmac-sha1');
const Base64 = require('crypto-js/enc-base64');

const functions = require('firebase-functions');
const friends = require('./twitter');
const keys = require('./keys');


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


app.post('/twitter/names', (req, res) => {
  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.storeNames(config, { screen_name: req.body.screen_name })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
      console.log(err)
    });
});


app.post('/twitter/suspended', (req, res) => {
  const config = {
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: req.body.token,
    access_token_secret: req.body.token_secret
  };

  friends.storeNames(config, { screen_name: req.body.screen_name })
    .then((data) => {
      friends.suspensionCheck(config, req.body.stored_data, data)
        .then((data) => {
          res.send(data)
        })
        .catch((err) => {
          res.send(err)
        });
    })
    .catch((err) => {
      res.send(err);
      console.log(err)
    });
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
      res.send(data)
    })
    .catch((err) => {
      res.send(err);
      console.log(err)
    })
});

exports.app = functions.https.onRequest(app);
