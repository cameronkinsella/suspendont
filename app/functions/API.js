import { AuthSession } from 'expo';
import * as SecureStore from 'expo-secure-store';
import Storage from './Storage'

//const AUTH_BASE_URL = 'http://localhost:5000/suspendont-a09bb/us-central1/app';
const AUTH_BASE_URL = 'https://us-central1-suspendont-a09bb.cloudfunctions.net/app';
const REDIRECT_URL = AuthSession.getRedirectUrl();

export async function getTwitterRequestToken() {
  const url = `${AUTH_BASE_URL}/auth/request_token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      redirect_uri: REDIRECT_URL
    })
  });
  return await res.json();
}

export async function getTwitterAccessToken(params) {
  const { oauth_token, oauth_token_secret, oauth_verifier } = params;
  const url = `${AUTH_BASE_URL}/auth/access_token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oauth_token, oauth_token_secret, oauth_verifier })
  });
  return await res.json();
}

export async function getVerifyUser(params) {
  const { token, token_secret } = params;
  const url = `${AUTH_BASE_URL}/auth/verify`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      token_secret: token_secret
    })
  });
  return await res.json();
}

export async function getInvalidateToken() {
  const url = `${AUTH_BASE_URL}/auth/invalidate_token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: await SecureStore.getItemAsync('token'),
      token_secret: await SecureStore.getItemAsync('token_secret')
    })
  });
  return await res.json();
}

export async function getTwitterSuspended() {
  const profile = await Storage.getItem('profile');
  const userId = profile.user_id;
  const token = await SecureStore.getItemAsync('token');
  const token_secret = await SecureStore.getItemAsync('token_secret');
  const url = `${AUTH_BASE_URL}/twitter/suspended`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      token: token,
      token_secret: token_secret
    })
  });

  const data = await res.json();

  let suspended = await Storage.getItem('suspended');
  let deleted = await Storage.getItem('deleted');

  suspended = initialize(suspended, userId);
  deleted = initialize(deleted, userId);

  if (data) {
    suspended[userId] = suspended[userId].concat(data.suspended);
    deleted[userId] = deleted[userId].concat(data.deleted);
  }

  await Storage.setItem('suspended', suspended);
  await Storage.setItem('deleted', deleted);
}

function initialize(data, id) {
  !data ?
    data = {} :
    null;
  !data[id] ?
    data[id] = [] :
    null;
  return data
}
