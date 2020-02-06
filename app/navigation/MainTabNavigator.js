import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import SuspendedScreen from '../screens/SuspendedScreen';
import DeletedScreen from '../screens/DeletedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Colors from '../constants/Colors';


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const SuspendedStack = createStackNavigator(
  {
    Suspended: SuspendedScreen,
  },
  config
);

SuspendedStack.navigationOptions = {
  tabBarLabel: 'Suspended',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-close-circle${focused ? '' : '-outline'}`
          : 'md-close-circle'
      }
    />
  ),
};

SuspendedStack.path = '';

const DeletedStack = createStackNavigator(
  {
    Deleted: DeletedScreen,
  },
  config
);

DeletedStack.navigationOptions = {
  tabBarLabel: 'Deleted',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}/>
  ),
};

DeletedStack.path = '';

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'logo-twitter'}/>
  ),
};

ProfileStack.path = '';

const tabNavigator = createMaterialBottomTabNavigator({
    SuspendedStack,
    DeletedStack,
    ProfileStack,
  },
  {
    initialRouteName: 'SuspendedStack',
    activeColor: Colors.tabIconSelected,
    inactiveColor: Colors.tabIconDefault,
    shifting: true,
    barStyle: { backgroundColor: Colors.tabBar },
  });

tabNavigator.path = '';

export default tabNavigator;
