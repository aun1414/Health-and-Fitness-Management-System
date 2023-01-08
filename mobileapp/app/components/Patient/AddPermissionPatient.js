import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  NavigationContainer } from '@react-navigation/native';
import GrantPermissionPatient from './GrantPermissionPatient';
import AddPermissionsPatient from './AddPermissionsPatient';
import InputKey from '../InputKey';
import MedicineFile from './MedicineFile';
import DoctorNoteFile from './DoctorNoteFile';
import LabResultsFile from './LabResultFile';
import { Alert, BackHandler, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const AddPermissionPatient = () => {

  
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
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='AddPermissionsPatient' component={AddPermissionsPatient} />
        <Stack.Screen name='GrantPermissionPatient' component={GrantPermissionPatient} />
        <Stack.Screen name='InputKey' component={InputKey} />
        <Stack.Screen name='MedicineFile' component={MedicineFile} />
        <Stack.Screen name='DoctorNoteFile' component={DoctorNoteFile} />
        <Stack.Screen name='LabResultFile' component={LabResultsFile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default AddPermissionPatient;
