import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _BackgroundTimer from 'react-native-background-timer';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import { HTTP_CLIENT_URL } from '../url';

const SplashScreen = () => {

    async function updateSteps(steps, date){
        try{
            const addressid = await AsyncStorage.getItem("addressid");
            const response = fetch(`${HTTP_CLIENT_URL}/patientProfile/updateSteps`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({addressid, steps, date}),
            }).then(async res => {
              //On Sucessufully returning from API collect response
              console.log(res);
              const d = await res.json();
               //checking if the response has status ok
              if (d.success) {
                console.log(d);
              }
              
            });
          }
          catch (error) {
            console.log(error);
          }

    }

    const fetchStepsData = async() => {
        var date = new Date();
        console.log("Today: ",date)
        var currDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          );
    
          var lastDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()+1,
          );
    
          console.log("Dates: ",currDate, lastDate)

        const opt = {
            startDate: currDate.toISOString(), // required ISO8601Timestamp
            endDate: lastDate.toISOString(), // required ISO8601Timestamp
            bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
            bucketInterval: 1, // optional - default 1.
        };
        const res = await GoogleFit.getDailyStepCountSamples(opt);
        if (res.length !== 0) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].source === 'com.google.android.gms:estimated_steps') {
              let data = res[i].steps.reverse();
              dailyStepCount = res[i].steps;
              console.log("Steps:",dailyStepCount)
              if (data.length === 0) {
                return 0;
              } else {
                return data[0].value;
              }
            }
          }
        } else {
          return 0;
        }
      };

    _BackgroundTimer.runBackgroundTimer(async ()=>{
        const ispatientloggedIn = await AsyncStorage.getItem("ispatientloggedIn");
        if(ispatientloggedIn==="1"){
            GoogleFit.checkIsAuthorized().then(async () => {
                var authorized = GoogleFit.isAuthorized;
                console.log(authorized);
                if (authorized) {
                  // if already authorized, fetch data
                  console.log("Authorized Steps")
                  const steps=await fetchStepsData();
                  var date = new Date();
                  await updateSteps(steps, date)
                    
                } else {
                  console.log("Not Authorized Steps")
                }
               
            });

        }
    

    }, 10000)

    //declare state variables
    const navigation = useNavigation();
    const image = { uri: "../images/appBack.jpg" };

    const navigateToPatient = () => {
        navigation.navigate('MainPatient');

    }
    const navigateToDoctor = () => {
        navigation.navigate('MainDoctor');
    }

    const navigateToStartPage = () => {
        navigation.navigate('StartPage');
    }

    React.useEffect(()=>{
        setTimeout(
           async () => { 
                const ispatientloggedIn = await AsyncStorage.getItem("ispatientloggedIn");
        if(ispatientloggedIn==="1"){
            navigateToPatient();

        }
        else{
            const isdoctorloggedIn = await AsyncStorage.getItem("isdoctorloggedIn");
            if(isdoctorloggedIn==="1"){
                navigateToDoctor();
            }
            else{
                navigateToStartPage();
            }

        }


             },
            3000
          )
        

    },[image]);
  


    return (
        <View style={styles.container}>
            
            <ImageBackground
                source={require('../images/appBack.jpg')}
                resizeMode='cover'
                style={{ height: '100%', width: '100%' }}>
                    <View style={styles.center}>
                <Image
                    source={require('../images/icon.png')}
                    style={styles.image}
                />
                <Text></Text>
                <Text
                    variant='headlineSmall'
                    style={{ color: 'white'}}>
                    Med-Chain
                </Text>
            </View>    
            </ImageBackground>
            
        </View>


    );

};

const styles = StyleSheet.create({
    container:{

    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
            marginTop: 'auto',
            marginBottom: 'auto'

    },
    image: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 200,
        height: 200,
    },
   
});

export default SplashScreen;
