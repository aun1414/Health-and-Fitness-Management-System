import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ViewPermissionPatient from './ViewPermissionPatient';
import AddPermissionPatient from './AddPermissionPatient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function ViewPermissions() {
  console.log('View')
  return (
    <ViewPermissionPatient />);
};


function AddPermissions() {
  console.log('Add')
  return (
    <AddPermissionPatient />);
};


const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function PatientPermission() {

  return (
    <NavigationContainer independent={true}>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarStyle: {
            //  backgroundColor: '#b0e0e6',
            backgroundColor: 'royalblue'
          },
        }} >
        <Tab.Screen name="Add Permissions" component={AddPermissions} />
        <Tab.Screen name="View Permissions" component={ViewPermissions} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#b0e0e6',
    backgroundColor: 'cornflowerblue',
    height: '100%'
  },


});

