import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';

import Storage from '../functions/Storage';
import Window from '../constants/Layout';
import Colors from '../constants/Colors';
import Font from '../constants/FontSizes';

export default function DeletedScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const deletedUsers = async () => {
      const profile = await Storage.getItem('profile');
      Storage.getItem('deleted').then((data) => {
        //console.log(data[profile.user_id]);

        setUsers(data[profile.user_id])
      })
    };

    deletedUsers().then();
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
                <Image source={require('../assets/images/trash.png')} style={{
                  width: 0.5 * Window.window.width,
                  height: 0.5 * Window.window.width,
                }}
                />
              </View>
              <Text style={text.greyText}>Nobody has deleted</Text>
              <Text style={text.greyText}>their account yet</Text>
            </View>
        }
      </ScrollView>
    </View>
  );
}

DeletedScreen.navigationOptions = {
  title: 'Deleted Users',
  headerStyle: {
    borderBottomWidth: 1
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
});

const text = StyleSheet.create({
  greyText: {
    color: Colors.greyLight,
    fontSize: Font.M
  }
});

/*      await Storage.setItem('deleted', [
      {
        screen_name: 'EpicArmageddon1',
        profile_pic: 'https://pbs.twimg.com/profile_images/1212171950555987968/ED2ymRLH_400x400.jpg',
        date: 'Apr 20, 2018'
      },
      {
        screen_name: 'sayori_nw',
        profile_pic: 'https://pbs.twimg.com/profile_images/1210372457317593088/11BlndDB_400x400.jpg',
        date: 'Dec 1, 2025'
      }
    ]);*/
