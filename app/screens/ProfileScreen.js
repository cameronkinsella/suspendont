import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Alert
} from 'react-native';

import { Text } from 'react-native-elements';
import Storage from '../functions/Storage';
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors';
import Font from '../constants/FontSizes';
import { getInvalidateToken } from '../functions/API';


export default function ProfileScreen() {
  const [profile, setProfile] = useState({});
  const [fontSize, setFontSize] = useState(Font.XL);


  useEffect(() => {
    async function getUserData() {
      const data = await Storage.getItem('profile');
      //console.log(data.profile_banner);
      //console.log(data.profile_pic);
      setProfile(await data);
    }

    getUserData().then();
  }, []);


  return (
    <View style={styles.container}>

      <View style={styles.banner}>
        <Image style={images.banner} resizeMode='cover' source=
          {
            profile.profile_banner === '../assets/images/light-banner.png' ?
              require('../assets/images/light-banner.png') : profile.profile_banner
          }
        />
      </View>

      <View style={{ flex: 1, paddingBottom: 20 }}>
        <View style={styles.icon}>
          <Image source={{ uri: profile.profile_pic }} style={images.icon}/>
        </View>
      </View>

      <View style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 40 + Font.M }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: fontSize, textAlign: 'center' }} adjustsFontSizeToFit numberOfLines={2}
                onLayout={(e) => {
                  Platform.OS === 'android' && e.nativeEvent.layout.height > 50 ? setFontSize(Font.M) : null
                }}
          >
            {profile.name}
          </Text>
          <Text numberOfLines={1} style={text.screen_name}>
            @{profile.screen_name}
          </Text>
          <View style={{ flexDirection: 'row', flex: 1, paddingTop: 20 }}>
            <Text style={text.friends_count}>{profile.friends_count}</Text>
            <Text style={{ ...text.friends_count, color: Colors.greyDark }}>Following</Text>
          </View>
        </View>
      </View>


      <View style={styles.tabBarInfoContainer}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.twitterButton} onPress={() => handleTwitterPress(profile.screen_name)}>
            <Text style={text.twitter}>Go to Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}
//const x = '🌉Radical Highway Designs (Commissions➡️Suspended)';
//const x = 'Riku HS';


function handleTwitterPress(username) {
  const twitterUrlScheme = `twitter://user?screen_name=${username}`;

  Linking.canOpenURL(twitterUrlScheme)
    .then((supported) =>
      Linking.openURL(
        supported
          ? twitterUrlScheme
          : `https://www.twitter.com/${username}`
      )
    )
    .catch((err) => console.error('An error occurred', err));
}

function handleLogoutPress(navigator) {

  Alert.alert(
    'Log out?',
    'Are you sure you would like to log out?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes', onPress: async () => {
          await getInvalidateToken();
          await SecureStore.deleteItemAsync('token');
          await SecureStore.deleteItemAsync('token_secret');
          navigator.navigate('Auth')
        }

      }
    ],
    {
      onDismiss: () => {
      }
    }
  )
}

ProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Your Profile',
  headerStyle: {
    borderBottomWidth: 1
  },
  headerRight: () => (
    <TouchableOpacity onPress={() => handleLogoutPress(navigation)}>
      <Ionicons
        size={26}
        style={{ paddingHorizontal: 20 }}
        color={Colors.tabIconSelected}
        name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'}
      />
    </TouchableOpacity>
  )

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: -30,
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: 'white'
  },
  icon: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1
  },
  twitterButton: {
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: '20%',
    borderWidth: 2,
    borderRadius: 50,
    borderColor: Colors.primary
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: '#fbfbfb',
      },
      android: {
        elevation: 2,
        borderTopWidth: 0.1,
        borderColor: '#000'
      },
    }),
    alignItems: 'center',
    paddingVertical: 20,
  },
});

const images = StyleSheet.create({
  icon: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderColor: Colors.secondary,
    borderWidth: 3,
    position: 'absolute'
  },
  banner: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start'
  },
});

const text = StyleSheet.create({
  screen_name: {
    fontStyle: 'italic',
    fontSize: Font.L,
    fontWeight: '300',
    color: Colors.greyDark
  },
  friends_count: {
    fontSize: Font.S,
    paddingHorizontal: 5 / 2,
  },
  twitter: {
    fontSize: Font.M,
    color: Colors.primary
  }
});
