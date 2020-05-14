import {getVerifyUser} from './api';

export default async function authCheck(cookies, setCookies, setState) {
  const token = cookies.token;
  const token_secret = cookies.token_secret;

  const _verifyUser = async ({token, token_secret}) => {
    const response = await getVerifyUser({token: token, token_secret: token_secret});

    if (response.statusCode === 429){ return 429 }
    return response.statusCode !== 200 ? 0 : _setUserInfo(response);
  };

  const _setUserInfo = async (data) => {
    setState(data);
    setCookies('__session', data.user_id, {path: '/'});

    return 1;
  };

  return !token ? 0 : await _verifyUser({token, token_secret});
}
