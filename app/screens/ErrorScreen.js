import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Font from '../constants/FontSizes';
import Colors from '../constants/Colors';

export default function ErrorScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: Font.XL, paddingVertical: 20 }}>Something went wrong!</Text>
      <Text style={{ fontSize: Font.S, paddingTop: 20 }}>Check your connection</Text>
      <Text style={{ fontSize: Font.S }}>and try reloading the app</Text>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
});
