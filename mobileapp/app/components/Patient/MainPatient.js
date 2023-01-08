import * as React from 'react';
import More from '../More';
import HomePatient from './HomePatient';
import PatientPermission from './PatientPermission';
import { useNavigation } from '@react-navigation/native';
import ProfilePatient from './ProfilePatient';
import { Alert, BackHandler, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();
const MainPatient = () => {


  const navigation = useNavigation();


  React.useEffect(() => {
  //what to do on pressing back button
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert(
          'Exit App',
          'Exiting the application',
          [
            {
              text: 'Cancel',
              onPress: () => {

              },
              style: 'cancel'
            },
            {
              text: 'Ok',
              onPress: () => {
                BackHandler.exitApp();
              }
            }
          ]
        );
        return true;
      }

    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])


  return (
    <Tab.Navigator
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

        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePatient}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (

            <Image source={focused ? require('../../images/whitehome.png') : require('../../images/whitehome.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />
      <Tab.Screen
        name="Permissions"
        component={PatientPermission}
        options={{
          tabBarLabel: 'My Permissions',
          tabBarIcon: ({ focused, color }) => (
            <Image source={focused ? require('../../images/whitepermission.png') : require('../../images/whitepermission.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />

      <Tab.Screen
        name="Profile"
        component={ProfilePatient}
        options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ focused, color }) => (
            <Image source={focused ? require('../../images/whiteprofile.png') : require('../../images/whiteprofile.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />

      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ focused, color }) => (
            <Image source={focused ? require('../../images/whitemore.png') : require('../../images/whitemore.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />

    </Tab.Navigator>
  );

}


export default MainPatient;