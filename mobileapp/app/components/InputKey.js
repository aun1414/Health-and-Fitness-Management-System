import React from 'react';
import {  View, StyleSheet,  BackHandler, ScrollView, ImageBackground } from 'react-native';
import { Text,Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const InputKey = ({ route }) => {
  //declare state variables
  console.log(route.params.path, route.params.hash)
  const [key, setKey] = React.useState("");
  const navigation = useNavigation();

  React.useEffect(() => {
    

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

    if(key.trim()===""){

    }
    else{
    
        navigation.navigate(route.params.path, {paramKey: key, hash: route.params.hash})
    }


  }

  return (
    <View style={styles.container}>
         <ImageBackground
                source={require('../images/appBack.jpg')}
                resizeMode="cover"
                style={{ height: '100%' }}>
                    

                    <ScrollView >
                        
                    <Text  style={{textAlign: 'center', color: 'white', margin: 5}} variant='headlineSmall'>Please Enter you private key for decrypting File</Text>
                        

                    <TextInput
                        label="Key"
                        value={key}
                        onChangeText={key => setKey(key)}
                        style={styles.textfield}
                        keyboardType='default'
                        multiline
                        numberOfLines={5}
                    />


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
    flex: 1, 
    
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
  textfield: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
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

export default InputKey;
