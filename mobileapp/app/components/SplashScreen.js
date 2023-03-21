import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
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
                    source={require('../images/splashscreen1.png')}
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
