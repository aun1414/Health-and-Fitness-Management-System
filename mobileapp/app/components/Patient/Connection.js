import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { Text, Button, Provider, Portal, Modal } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'


const Connection = () => {

    const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
          Scopes.FITNESS_BLOOD_PRESSURE_READ,
          Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
          Scopes.FITNESS_BLOOD_GLUCOSE_READ,
          Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
          Scopes.FITNESS_NUTRITION_WRITE,
          Scopes.FITNESS_SLEEP_READ,
          Scopes.FITNESS_HEART_RATE_READ,
          Scopes.FITNESS_HEART_RATE_WRITE,
          Scopes.FITNESS_BODY_TEMPERATURE_READ,
          Scopes.FITNESS_BODY_TEMPERATURE_WRITE,
        ],
      };

  const navigation = useNavigation();
  const [fitAuthorized, setFitAuthorized] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState("");

  React.useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;


    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])

  React.useEffect(()=>{
    GoogleFit.checkIsAuthorized().then(() => {
        var authorized = GoogleFit.isAuthorized;
        if (authorized) {
          // if already authorized
          setFitAuthorized("Authorized")
          
        } else {
            // if not authorized
          setFitAuthorized("Not Authorized")
          
        }
        console.log("Athorization: ",fitAuthorized);
    });
  }, [fitAuthorized])


  const connect = async () =>{
    console.log("Connecting....")
    GoogleFit.authorize(options)
    .then(authResult => {
      console.log(authResult)
      if (authResult.success) {
        console.log('AUTH_SUCCESS');
        setFitAuthorized("Authorized");
        setModalMsg('Connection successfull')
        setModalVisible(true)
        // if successfully authorized, fetch data
      } else {
        console.log('AUTH_DENIED ' + authResult.message);
        setModalMsg(authResult.message)
        setModalVisible(true)
      }
    })
    .catch(() => {
      console.log("catch")
      setModalMsg('Error')
        setModalVisible(true)
      // dispatch('AUTH_ERROR');
    });
    
    console.log("done")
  }

  const disconnect =() =>{
    GoogleFit.disconnect();
    setModalMsg('Disconnected Succesfully')
    setModalVisible(true)
    setFitAuthorized("Not Authorized")
  }

  //function to be called on closing modal 
  const ok = () => {
    //making ModalVisible false to hide the modal
    setModalVisible(false);
    
  }


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
              {modalMsg}
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
      <BackAppBar message={"Connection"} />
      <ImageBackground
        source={require('../../images/appBack.jpg')}
        resizeMode="cover"
        style={{ height: '100%' }}>
            
            <View style={{marginTop: 80}}>
            {
                fitAuthorized=="Not Authorized" && 
                <Button
                    buttonColor='royalblue'
                    style={styles.button}
                    mode="contained"
                    onPress={connect}>
                    <Text style={{color: 'white'}}>
                        Connect with Google Fit
                    </Text>
                </Button>
              

            }
            {
                fitAuthorized=="Authorized" && 
                <Button
                    buttonColor='royalblue'
                    style={styles.button}
                    mode="contained"
                    onPress={disconnect}>
                    <Text style={{color: 'white'}}>
                        Disconnect with Google Fit
                    </Text>
                </Button>
              

            }
</View>
                   

      </ImageBackground>
    </View>
    </Provider>
  );

};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#b0e0e6',
    height: '100%'
  },
  rows: {
    marginTop: 80

  },
  button:{
    margin: 20,
  },
  card: {
    width: '90%',
    height: 90,
    margin: '5%',
    borderRadius: 20,
    textAlign: 'center'

  },
  modalAge: {
    backgroundColor: 'white',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
    borderRadius: 10

  },
  maincard: {
    borderRadius: 20,
    height: 90,
    backgroundColor: 'whitesmoke',

  },
  okbutton: {
    margin: 10,

  },

});

export default Connection;
