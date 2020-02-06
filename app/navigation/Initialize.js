import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import * as SecureStore from 'expo-secure-store';
import AnimatedLoader from 'react-native-animated-loader';

import { getTwitterSuspended, getVerifyUser } from '../functions/API';
import Storage from '../functions/Storage';
import Colors from '../constants/Colors';


export default function Initialize() {
  const navigator = useNavigation();

  useEffect(() => {
    const getRouteAsync = async () => {
      const { token, token_secret } = await _checkLoginAsync();
      try {
        await navigator.navigate(!token ? 'Auth' : await _verifyUser({ token, token_secret }));
      } catch (e) {
        navigator.navigate('Error')
      }
    };

    getRouteAsync().then();
  });

  return (
    <View style={styles.container}>
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={require('../assets/loader')}
        animationStyle={styles.lottie}
        speed={1}
      />
    </View>
  )
}

async function _checkLoginAsync() {
  const storedTokens = {
    token: await SecureStore.getItemAsync('token'),
    token_secret: await SecureStore.getItemAsync('token_secret')
  };
  //console.log(storedTokens);
  return storedTokens;
}

async function _verifyUser({ token, token_secret }) {
  const response = await getVerifyUser({ token, token_secret });
  //console.log(response.statusCode);
  return response.statusCode !== 200 ? 'Auth' : _setUserInfo(response)
}

async function _setUserInfo(data) {
  const banner = typeof data.profile_banner == 'undefined' ?
    '../assets/images/light-banner.png' :
    { uri: data.profile_banner };

  banner !== '../assets/images/light-banner.png' ?
    await Promise.all([Image.prefetch(data.profile_pic), Image.prefetch(banner.uri)]) :
    null;

  await Storage.setItem('profile', {
    user_id: data.user_id,
    name: data.name.includes('@') ? data.name.split('@')[0] : data.name,
    screen_name: data.screen_name,
    friends_count: data.friends_count,
    profile_pic: data.profile_pic,
    profile_banner: banner
  });
  //console.log('start');

  await getTwitterSuspended();
  return 'Main'

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: Colors.secondary
  },
  lottie: {
    width: 250,
    height: 250
  }
});
