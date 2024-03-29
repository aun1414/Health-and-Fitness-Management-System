import React from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, ScrollView, BackHandler } from 'react-native';
import { TextInput, Button, Provider, Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { HTTP_CLIENT_URL } from '../../url';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SigninDoctor = () => {

    //declare state variables  
    const navigation = useNavigation();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [modalVisible, setModalVisible] = React.useState(false);
    const [result, setResult] = React.useState("");

    //sign in by checking if login id and password matches with database
    const signin = () => {
        // console.log(addressid, ' ', password)
        // console.log('Sign in')
        // navigation.navigate('MainDoctor');

        if(email.trim()===''){
            setResult("Email Id is required");
            setModalVisible(true);
        }
        else if(password.trim()===''){
            setResult("Password is required");
            setModalVisible(true);
        }
        else if (password.length < 6) {
          setResult("Password should be 6 characters long");
          setModalVisible(true);
        }
        else{
            const response = fetch(`${HTTP_CLIENT_URL}/doctor/signin`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password  }),
              }).then(async res => {
                //On Sucessufully returning from API collect response
                const d = await res.json();
                console.log(d);
          
                 //checking if the response has status ok
                if (d.success) {
                  console.log(d.doctor.addressid);
                  
    
                  fetch(`${HTTP_CLIENT_URL}/contracts/signinDoctor`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ addressid: d.doctor.addressid }),
                  }).then(async res => {
                    //On Sucessufully returning from API collect response
                    const d1 = await res.json();
                    console.log(d1);
              
                     //checking if the response has status ok
                    if (d1.success) {
    
                      try {
                        await AsyncStorage.setItem(
                          'addressid',
                          d.doctor.addressid,
                        );
                        await AsyncStorage.setItem(
                            'isdoctorloggedIn',
                            "1",
                          );
                          navigation.navigate("MainDoctor");
                      } catch (error) {
                        setResult(error);
                        setModalVisible(true);
                        // Error saving data
                      }
    
                    }
                    else {

                      setResult("Error!");
                      setModalVisible(true);
                  }
                  });
                  
                  
                }
                else {
                    setResult(d.error);
                    setModalVisible(true);
                }
              });
            
        }
    }

    const navigateToSignup = () => {
        navigation.navigate('SignupDoctor');
    }

    const navigateToForgetPassword = () => {
        navigation.navigate('ForgotPasswordDoctor');
    }

    const ok = () => {
        setModalVisible(false);

    }

    React.useEffect(() => {

      const backAction = () => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, [])


    return (
        <Provider>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={ok}
            contentContainerStyle={styles.modalAge}>
            <View>
  
              <Text
                style={{ margin: 10, textAlign: 'center' }}>
                {result}
              </Text>
  
              <Button
                mode='contained'
                buttonColor='#00ced1'
                style={styles.okbutton}
                onPress={ok}>
                Ok
              </Button>
  
            </View>
     
          </Modal>
        </Portal>
        <View style={styles.container}>
            <ImageBackground
                source={require('../../images/appBack.jpg')}
                resizeMode="cover"
                style={{ height: '100%' }}>
                <ScrollView>
                <Image
                    source={require('../../images/doctor.jpg')}
                    style={styles.image}
                />
                <TextInput
                    label="Email Id"
                    value={email}
                    onChangeText={email => setEmail(email)}
                    style={styles.textfield}
                    keyboardType='default'
                />
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    textContentType={'password'}
                    style={styles.textfield}
                    value={password}
                    onChangeText={password => setPassword(password)}
                   
                />

                <Button
                    buttonColor='royalblue'
                    style={styles.button}
                    mode="contained"
                    onPress={signin}>
                    <Text>Sign in</Text>
                </Button>

                <View style={styles.rowline}>
                    <Text
                        style={styles.linktext}
                        onPress={navigateToSignup}>
                        Sign up
                    </Text>

                    <Text
                        style={styles.linktext}
                        onPress={navigateToForgetPassword}>
                        Forgot Password?
                    </Text>
                </View>
                </ScrollView>
            </ImageBackground>

        </View>
        </Provider>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        // backgroundColor: '#b0e0e6'
    },
    image: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 10
    },
    textfield: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10
    },
    button: {
        margin: 20
    },
    linktext: {
        color: 'white',
        fontSize: 16,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10
    },
    rowline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    modalAge: {
        backgroundColor: 'white',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        borderRadius: 10
    
      },
});

export default SigninDoctor;
