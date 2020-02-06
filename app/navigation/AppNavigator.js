import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Initialize from './Initialize';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import ErrorScreen from '../screens/ErrorScreen';

export default createAppContainer(
  createSwitchNavigator(
    {
      Load: Initialize,
      Auth: LoginScreen,
      Error: ErrorScreen,
      Main: MainTabNavigator
    }, {
      initialRouteName: 'Load',
    })
);
