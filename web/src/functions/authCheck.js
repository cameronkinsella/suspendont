import { getVerifyUser } from './api';

export default async function authCheck(cookies, setCookies, setState) {
  const token = cookies.token;
  const token_secret = cookies.token_secret;

  const _verifyUser = async ({ token, token_secret }) => {
    const response = await getVerifyUser({ token: token, token_secret: token_secret });
    return response.statusCode !== 200 ? false : _setUserInfo(response);
  };

  const _setUserInfo = async(data) => {
    const banner = typeof data.profile_banner == 'undefined' ?
      '../assets/light-banner.png' :
      { uri: data.profile_banner };

    setState({
      name: data.name,
      screen_name: data.screen_name,
      friends_count: data.friends_count,
      profile_pic: data.profile_pic,
      profile_banner: banner,
    });

    setCookies('user_id', data.user_id, { path: '/' });

    return true;
  };

  return !token ? false : await _verifyUser({ token, token_secret });
}
