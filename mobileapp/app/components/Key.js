import React from 'react';
import {  View, StyleSheet,  BackHandler, ScrollView, ImageBackground } from 'react-native';
import { Text,Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Key = ({ route }) => {
  //declare state variables
  console.log(route.params.paramKey)
  const [key, setKey] = React.useState("");
  const [addressid, setAddressid] = React.useState("")
  const navigation = useNavigation();

  React.useEffect(async () => {
    console.log("Key")
    setKey(route.params.paramKey);
    const addressid = await AsyncStorage.getItem("addressid");
    setAddressid(addressid)

  }, [route]);

  React.useEffect(() => {
    //what to do on pressing back button
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])

  const done =() =>{

    if(route.params.role==='doctor'){
        navigation.navigate('MainDoctor')
    }
    else if(route.params.role==='patient'){
        navigation.navigate('MainPatient')
    }

    

  }

  return (
    <View style={styles.container}>
         <ImageBackground
                source={require('../images/appBack.jpg')}
                resizeMode="cover"
                style={{ height: '100%' }}>
                    <ScrollView>

                    <Text  style={{textAlign: 'center', color: 'white'}} variant='headlineSmall'>Please note your account address</Text>
                        
                        <Text selectable={true} style={styles.input}>{addressid}</Text>

                        <Text  style={{textAlign: 'center', color: 'white'}} variant='headlineSmall'>Please note your private key</Text>
                        
                        <Text selectable={true} style={styles.input}>{key}</Text>


                        <Button
                    buttonColor='royalblue'
                    style={styles.button}
                    mode="contained"
                    onPress={done}>
                    <Text style={{color: 'white'}}>Done</Text>
                </Button>
      
        </ScrollView>
        </ImageBackground>
        
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#b0e0e6',
    height: '100%'
  },
  texfield: {
    width: 220,
    marginEnd: 10,

  },
  button: {
    margin: 20
    },
  input: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white'
  },
  rows: {
    marginTop: 20
  },
  card: {
    width: '90%',
    marginHorizontal: '5%',
    marginVertical: 10,
    borderRadius: 20,
    textAlign: 'center',

  },
  maincard: {
    borderRadius: 20,
    backgroundColor: 'whitesmoke',

  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 20,
    width: 180,
    height: 180
  },
  bordercolum: {
    borderColor: 'black',
    minHeight: 70,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    alignContent: 'center',
    padding: 10
  },
  borderRight: {
    borderRightColor: 'black',
    minHeight: 70,
    borderRightWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  borderLeft: {
    borderLeftColor: 'black',
    minHeight: 70,
    borderLeftWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',

  }


});

export default Key;
