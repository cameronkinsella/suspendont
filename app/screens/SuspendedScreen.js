import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { Card, ListItem } from 'react-native-elements'

import Storage from '../functions/Storage';
import Window from '../constants/Layout'
import Colors from '../constants/Colors';
import Font from '../constants/FontSizes';

// TODO make cards interactive
// TODO uncomment code in index to add to db
// TODO fonts

//import { MonoText } from '../components/StyledText';

export default function SuspendedScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const suspendedUsers = async () => {
      const profile = await Storage.getItem('profile');
      Storage.getItem('suspended').then((data) => {
        //console.log(data[profile.user_id]);

        setUsers(data[profile.user_id])
      })
    };

    suspendedUsers().then();
  }, []);


  return (

    <View style={styles.container}>
      <ScrollView>
        {
          users.length !== 0 ?
            users.map((u, i) => (
                <Card containerStyle={{ padding: 0 }} key={i}>
                  <ListItem
                    key={i}
                    title={'@' + u.screen_name}
                    rightSubtitle={u.date}
                    leftAvatar={{ source: { uri: u.profile_pic } }}
                  />
                </Card>
              )
            ) :
            <View style={{ ...styles.container, alignItems: 'center' }}>
              <View style={{ ...styles.container, paddingVertical: 50 }}>
                <Image source={require('../assets/images/gavel.png')} style={{
                  width: 0.5 * Window.window.width,
                  height: 0.5 * Window.window.width,
                }}
                />
              </View>
              <Text style={text.greyText}>Nobody has been</Text>
              <Text style={text.greyText}>suspended yet</Text>
            </View>
        }
      </ScrollView>
    </View>
  );
}

SuspendedScreen.navigationOptions = {
  title: 'Suspended Users',
  headerStyle: {
    borderBottomWidth: 1
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  }
});

const text = StyleSheet.create({
  greyText: {
    color: Colors.greyLight,
    fontSize: Font.M
  }
});

/*      await Storage.setItem('suspended', [
      {
        screen_name: '699rokuku_maa',
        profile_pic: 'https://pbs.twimg.com/profile_images/1195391300213719047/dYUe8IiZ_400x400.jpg',
        date: 'Jun 6, 2019'
      },
      {
        screen_name: 'kunabishi',
        profile_pic: 'https://pbs.twimg.com/profile_images/1174439626020278272/NL7mtNSe_normal.png',
        date: 'Jan 26, 2020'
      }
    ]);*/
