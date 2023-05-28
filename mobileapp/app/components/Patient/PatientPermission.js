import * as React from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import { Text } from 'react-native-paper'
import ViewPermissionPatient from './ViewPermissionPatient';
import AddPermissionPatient from './AddPermissionPatient';
import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";

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
      drawerContent={(props) => (
        <ImageBackground source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>
          <View
            style={{
              marginTop: 50
            }}>
            <Image
              source={require('../../images/whitepermission.png')}
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                resizeMode: 'contain',
                marginBottom: 10,
              }} />
            <Text
              style={{
                alignSelf: 'center',
                marginBottom: 50,
                color: 'white',
                fontWeight: 'bold',
                fontSize: 20,
              }}>Permissions</Text>

          <DrawerItemList {...props} />
        </View>


        </ ImageBackground>
      )}
      screenOptions={{
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: 'slateblue',
        drawerInactiveTintColor: 'white,',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        drawerLabelStyle: {
          fontSize: 15,
          color: 'white'
        },
        headerStyle: {
          backgroundColor: 'royalblue',
        },
        drawerStyle: {
          color: 'white'
          // backgroundColor: 'PowderBlue',
          // paddingTop: 80
        }
      }}>
      <Drawer.Screen
        name="Add Permissions"
        options={{
          drawerIcon: ({ focused, color }) => (
            <Image
              source={focused ? require('../../images/grant.png') : require('../../images/grant.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginRight: 5,
              }} />

          ),
        }}
        component={AddPermissions} />
      <Drawer.Screen
        name="View Permissions"
        options={{
          drawerIcon: ({ focused, color }) => (
            <Image
              source={focused ? require('../../images/view.png') : require('../../images/view.png')}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginRight: 5,
              }} />

          ),
        }}
        component={ViewPermissions} />
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
