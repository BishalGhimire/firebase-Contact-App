import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';

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

var firebaseConfig = {
  apiKey: "AIzaSyAhSd4jq6ksbbA0BMJQR08ITWVybVpWzUI",
  authDomain: "reactbootcamp-51eb6.firebaseapp.com",
  databaseURL: "https://reactbootcamp-51eb6.firebaseio.com",
  projectId: "reactbootcamp-51eb6",
  storageBucket: "reactbootcamp-51eb6.appspot.com",
  messagingSenderId: "395297520098",
  appId: "1:395297520098:web:7d2c74c512bf441e35a1bb",
  measurementId: "G-YTN25K3WH9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);





export default App;