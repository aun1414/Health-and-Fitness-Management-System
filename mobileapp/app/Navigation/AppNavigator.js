import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartPage from '../components/StartPage';
import SigninPatient from '../components/Patient/SigninPatient';
import SignupPatient from '../components/Patient/SignupPatient';
import SigninDoctor from '../components/Doctor/SigninDoctor';
import SignupDoctor from '../components/Doctor/SignupDoctor';
import ForgotPasswordDoctor from '../components/Doctor/ForgotPasswordDoctor';
import ForgotPasswordPatient from '../components/Patient/ForgotPasswordPatient';
import MainPatient from '../components/Patient/MainPatient';
import Vitals from '../components/Patient/Vitals';
import Exercise from '../components/Patient/Exercise';
import MedicationsPatient from '../components/Patient/MedicationsPatient';
import DoctorNotesPatient from '../components/Patient/DoctorNotesPatient';
import LabResultsPatient from '../components/Patient/LabResultsPatient';
import MainDoctor from '../components/Doctor/MainDoctor';
import AddDoctorNotes from '../components/Doctor/AddDoctorNotes';
import AddLabResults from '../components/Doctor/AddLabResults';
import AddMedications from '../components/Doctor/AddMedications';
import MedicineInfo from '../components/Patient/MedicineInfo';
import DoctorNoteInfo from '../components/Patient/DoctorNoteInfo';
import LabResultsInfo from '../components/Patient/LabResultInfo';
import GrantPermissionPatient from '../components/Patient/GrantPermissionPatient';
import Key from '../components/Key';
import InputKey from '../components/InputKey';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from '../components/SplashScreen';
import Connection from '../components/Patient/Connection';
import HeartRate from '../components/Patient/HeartRate';
import BloodPressure from '../components/Patient/BloodPressure';
import Temperature from '../components/Patient/Temperature';
import HeartRateData from '../components/Patient/HeartRateData';
import BloodPressureData from '../components/Patient/BloodPressureData';
import TemperatureData from '../components/Patient/TemperatureData';
import DailyStep from '../components/Patient/DailyStep';
import BloodPressureFileDoc from '../components/Doctor/BloodPressureFileDoc';
import HeartRateFileDoc from '../components/Doctor/HeartRateFileDoc';
import TemperatureFileDoc from '../components/Doctor/TemperatureFileDoc';
import Ranks from '../components/Patient/Ranks';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {







  return (
   <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='SplashScreen' component={SplashScreen} />
    <Stack.Screen name='StartPage' component={StartPage} />
    <Stack.Screen name='SigninPatient' component={SigninPatient} />
    <Stack.Screen name='SignupPatient' component={SignupPatient} />
    <Stack.Screen name='SigninDoctor' component={SigninDoctor} />
    <Stack.Screen name='SignupDoctor' component={SignupDoctor} />
    <Stack.Screen name='ForgotPasswordDoctor' component={ForgotPasswordDoctor} />
    <Stack.Screen name='ForgotPasswordPatient' component={ForgotPasswordPatient} />
    <Stack.Screen name='MainPatient' component={MainPatient} />
    <Stack.Screen name='Vitals' component={Vitals} />
    <Stack.Screen name='Exercise' component={Exercise} />
    <Stack.Screen name='MedicationsPatient' component={MedicationsPatient} />
    <Stack.Screen name='DoctorNotesPatient' component={DoctorNotesPatient} />
    <Stack.Screen name='LabResultsPatient' component={LabResultsPatient} />
    <Stack.Screen name='MainDoctor' component={MainDoctor} />
    <Stack.Screen name='AddDoctorNotes' component={AddDoctorNotes} />
    <Stack.Screen name='AddLabResults' component={AddLabResults} />
    <Stack.Screen name='AddMedications' component={AddMedications} />
    <Stack.Screen name='MedicineInfo' component={MedicineInfo} />
    <Stack.Screen name='DoctorNoteInfo' component={DoctorNoteInfo} />
    <Stack.Screen name='LabResultInfo' component={LabResultsInfo} />
    <Stack.Screen name='Key' component={Key} />
    <Stack.Screen name='InputKey' component={InputKey} />
    <Stack.Screen name='Connection' component={Connection} />
    <Stack.Screen name='HeartRate' component={HeartRate} />
    <Stack.Screen name='BloodPressure' component={BloodPressure} />
    <Stack.Screen name='Temperature' component={Temperature} />
    <Stack.Screen name='HeartRateData' component={HeartRateData} />
    <Stack.Screen name='BloodPressureData' component={BloodPressureData} />
    <Stack.Screen name='TemperatureData' component={TemperatureData} />
    <Stack.Screen name='DailyStep' component={DailyStep} />
    <Stack.Screen name='BloodPressureFileDoc' component={BloodPressureFileDoc} />
    <Stack.Screen name='HeartRateFileDoc' component={HeartRateFileDoc} />
    <Stack.Screen name='TemperatureFileDoc' component={TemperatureFileDoc} />
    <Stack.Screen name='Ranks' component={Ranks} />
   </Stack.Navigator>

  );
 
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
