import React, { useEffect } from 'react';
import { StyleSheet, View }  from 'react-native';

import Colors from '../constants/Colors';
import LoginButton from '../components/LoginButton'

export default function LoginScreen() {

  useEffect(() => {
    //Storage.multiRemove(['token', 'token_secret']).then(); // No longer needed ?
  });

  return (
    <View style={styles.container}>
      <LoginButton/>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
