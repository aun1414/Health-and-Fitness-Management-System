import React from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/Navigation/AppNavigator';

const App = () => {

  return (

    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors } }}>
      <AppNavigator />
    </NavigationContainer>

  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
  },

});

export default App;
