import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './Screens/HomeScreen';
import AddNewContactScreen from './Screens/AddNewContactScreen';
import EditContactScreen from './Screens/EditContactScreen';


const mainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Add: { screen: AddNewContactScreen},
  View: {screen: AddNewContactScreen },
  Edit: {screen: EditContactScreen}
});

const App = createAppContainer(mainNavigator);
export default App;