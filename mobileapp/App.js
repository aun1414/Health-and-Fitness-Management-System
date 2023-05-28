import React from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/Navigation/AppNavigator';
import { AppProvider } from './app/components/Patient/AppContext';

const App = () => {

  return (
    <AppProvider>
      <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors } }}>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>

  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
  },

});

export default App;
