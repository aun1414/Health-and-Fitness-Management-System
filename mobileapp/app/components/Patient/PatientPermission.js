import * as React from 'react';
import { StyleSheet } from 'react-native';
import ViewPermissionPatient from './ViewPermissionPatient';
import AddPermissionPatient from './AddPermissionPatient';
import { createDrawerNavigator } from "@react-navigation/drawer";

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


// const Tab = createMaterialTopTabNavigator();
// const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

export default function PatientPermission() {

    return (
      
    <Drawer.Navigator 
      initialRouteName="Add Permissions" 
      independent={true}
      screenOptions={{
        tabBarActiveBackgroundColor: 'slateblue',
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'royalblue',
        },
        tabBarStyle: {
          //  backgroundColor: '#b0e0e6',
          backgroundColor: 'royalblue',
          height: 65,
        },
        drawerStyle: {
          backgroundColor: 'skyblue',
        }
    }}>
      <Drawer.Screen name="Add Permissions" component={AddPermissions} />
      <Drawer.Screen name="View Permissions" component={ViewPermissions} />
    </Drawer.Navigator>
  );

  // return (
  //   <NavigationContainer independent={true}>

  //     <Tab.Navigator
  //       screenOptions={{
  //         tabBarActiveTintColor: 'white',
  //         tabBarStyle: {
  //           //  backgroundColor: '#b0e0e6',
  //           backgroundColor: 'royalblue'
  //         },
  //       }} >
  //       <Tab.Screen name="Add Permissions" component={AddPermissions} />
  //       <Tab.Screen name="View Permissions" component={ViewPermissions} />
  //     </Tab.Navigator>
  //   </NavigationContainer>

  // );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#b0e0e6',
    backgroundColor: 'cornflowerblue',
    height: '100%'
  },


});
