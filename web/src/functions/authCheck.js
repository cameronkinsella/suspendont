import { getVerifyUser } from './api';

export default async function authCheck(cookies, setCookies, setState) {
  const token = cookies.token;
  const token_secret = cookies.token_secret;

  const _verifyUser = async ({ token, token_secret }) => {
    const response = await getVerifyUser({ token: token, token_secret: token_secret });
    return response.statusCode !== 200 ? false : _setUserInfo(response);
  };

  const _setUserInfo = async(data) => {
    setState(data);
    setCookies('user_id', data.user_id, { path: '/' });

    return true;
  };

  return !token ? false : await _verifyUser({ token, token_secret });
}
