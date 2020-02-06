import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import Colors from '../constants/Colors';
import { getTwitterAccessToken, getTwitterRequestToken } from '../functions/API';
import { AuthSession } from 'expo';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function LoginButton() {
  const [iconAnim] = useState(new Animated.Value(1 / 100000));
  const [textAnim] = useState(new Animated.Value(1 / 100000));
  const [shrinkAnim] = useState(new Animated.Value(width + height));
  const [isAnimating, finishAnimating] = useState(true);

  const navigator = useNavigation();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(
        shrinkAnim,
        {
          toValue: 200,
          duration: 1000,
        }
      ),
      Animated.parallel([
        Animated.timing(
          iconAnim,
          {
            toValue: 58,
            duration: 1000,
          }
        ),
        Animated.timing(
          textAnim,
          {
            toValue: 28,
            duration: 1000,
          }
        )
      ])
    ]).start(() => finishAnimating(false))
  });

  return (
    <AnimatedTouchable
      disabled={isAnimating}
      onPress={() => handleTwitterLogin(navigator)}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
        width: shrinkAnim,
        height: shrinkAnim,
        borderRadius: shrinkAnim
      }}
    >
      <AnimatedIcon
        name={'logo-twitter'}
        color={Colors.primary}
        style={{ paddingHorizontal: 20, fontSize: iconAnim }}
      />
      <Animated.Text style={{ color: Colors.primary, fontSize: textAnim }}>
        Log in
      </Animated.Text>

    </AnimatedTouchable>
  );
}

const handleTwitterLogin = async (navigator) => {

  const { oauth_token, oauth_token_secret } = await getTwitterRequestToken();

  const { params } = await AuthSession.startAsync({
    authUrl: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
  });

  const oauth_verifier = params.oauth_verifier;
  const result = await getTwitterAccessToken({ oauth_token, oauth_token_secret, oauth_verifier });
  //console.log(result.oauth_token);
  //console.log(result.oauth_token_secret);
  await SecureStore.setItemAsync('token', result.oauth_token);
  await SecureStore.setItemAsync('token_secret', result.oauth_token_secret);

  navigator.navigate('Load');
};
