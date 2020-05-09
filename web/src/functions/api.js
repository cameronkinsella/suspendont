function isDev() {
  return !'%NODE_ENV%' || '%NODE_ENV%' === 'development';
}

const AUTH_BASE_URL = isDev() ?
  'http://localhost:5000/suspendont-a09bb/us-central1/app' :
  'https://us-central1-suspendont-a09bb.cloudfunctions.net/app';

const REDIRECT_URL = `${window.origin}/auth`;

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
