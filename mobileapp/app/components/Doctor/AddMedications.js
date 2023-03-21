import React from 'react';
import { ScrollView, View, StyleSheet, Image, BackHandler, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Portal, TextInput, Provider, Modal, Button } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import '../../file';
import { HTTP_CLIENT_URL } from '../../url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';




const AddMedications = () => {

  // declaring variables
  const navigation = useNavigation();
  const [medicine, setMedicine] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState("");
  const [patient, setPatient] = React.useState("");
  const [days, setDays] = React.useState();
  const [diagnosis, setDiagnosis] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [dateInput, setDateInput] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false)

  //function to be called on pressing add button
  async function add() {
    fetch(`${HTTP_CLIENT_URL}/patient/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addressid: patient }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d1 = await res.json();
      console.log(d1);

       //checking if the response has status ok
      if (d1.success) {

        const mypatient=d1.patient
        console.log(mypatient)

        const doctorid=await AsyncStorage.getItem('addressid');

       
        const dataToEncrypt={file: 'Medication', patient: patient, doctor: doctorid, medicine, dosage, days, diagnosis, date: date.toLocaleString() }

        fetch(`${HTTP_CLIENT_URL}/rsa/encrypt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: mypatient.publickey, dataToEncrypt }),
        }).then(async res => {
          //On Sucessufully returning from API collect response
          const d1 = await res.json();
          console.log(d1);
    
            //checking if the response has status ok
          if (d1.success) {
            fetch(`${HTTP_CLIENT_URL}/ipfs/uploadFile`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ file: "Medication.json", content: d1.encryptedFile }),
            }).then(async res => {
              //On Sucessufully returning from API collect response
              const d2 = await res.json();
              console.log(d2);
        
                //checking if the response has status ok
              if (d2.success) {
                fetch(`${HTTP_CLIENT_URL}/contracts/uploadFile`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ patientid: mypatient.addressid, doctorid: doctorid,  fileType: "Medication", hash: d2.hashValue }),
                }).then(async res => {
                  //On Sucessufully returning from API collect response
                  const d = await res.json();
                  console.log(d);
            
                    //checking if the response has status ok
                  if (d.success) {
            
                    setModalMsg("Medicine Added Succesfully");
                    setModalVisible(true);
                    
            
                  }
                  else {
                    console.log(d)
                    setModalMsg("Error uploading to Blockchain");
                    setModalVisible(true);
                }
                });
                
                
        
              }
              else {
                console.log(d2)
                setModalMsg("Error uploading to IPFS");
                setModalVisible(true);
            }
            });
            
            
    
          }
          else {
            console.log(d1)
            setModalMsg("Error Encrypting File");
            setModalVisible(true);
        }
        });
            
    
        
        

      }
      else {
        console.log(d1)
        setModalMsg(d1.error);
        setModalVisible(true);
    }
    });
    
  }

  //function to be called on closing modal displaying medicine is added
  const ok = () => {
    //making ModalVisible false to hide the modal that medicine is added
    setModalVisible(false);

    if(modalMsg==="Medicine Added Succesfully"){
      //navigates to doctor home page
      navigation.navigate('MainDoctor');
    }
    
  }

 

  React.useEffect(() => {
    //handle back button pressed
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])

  React.useEffect(()=>{

  })



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
        <BackAppBar message={"Add Medications"} />
        <ImageBackground
          source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>
          <ScrollView style={{ marginTop: 60 }}>

            <Image
              source={require('../../images/medication.jpg')}
              style={styles.image}
            />
            <TextInput
              label="Patient"
              value={patient}
              onChangeText={text => setPatient(text)}
              style={styles.textfield}
            />

            <TextInput
              label="Medicine Name"
              value={medicine}
              onChangeText={text => setMedicine(text)}
              style={styles.textfield}
            />

            <TextInput
              label="Dosage"
              value={dosage}
              onChangeText={text => setDosage(text)}
              style={styles.textfield}
            />

            <TextInput
              label="Days"
              value={days}
              keyboardType='numeric'
              onChangeText={text => setDays(text)}
              style={styles.textfield}
            />

            <TextInput
              label="Diagnosis"
              value={diagnosis}
              onChangeText={text => setDiagnosis(text)}
              style={styles.textfield}
            />

<TouchableOpacity
            onPress={() => setOpen(true)}>
            <TextInput
              label="Date"
              value={date.toLocaleString()}
              style={styles.textfield}
            editable={false}
            />
            
            </TouchableOpacity>
            <DatePicker
                    modal
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    }}
                    onCancel={() => {
                    setOpen(false)
                    }}
                />


            <Button buttonColor='royalblue' style={styles.button} mode="contained" onPress={add}>
              <Text style={{ color: 'white' }}>Add</Text>
            </Button>

          </ScrollView>
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
  uri: {
    marginTop: 20
  },
  card: {
    width: '90%',
    height: 90,
    margin: '5%',
    borderRadius: 20,
    textAlign: 'center'

  },
  maincard: {
    borderRadius: 20,
    height: 90,
    backgroundColor: 'whitesmoke',

  },
  okbutton: {
    margin: 10,

  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 20,
    width: 180,
    height: 180
  },
  modalAge: {
    backgroundColor: 'white',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
    borderRadius: 10

  },
  textfield: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    margin: 20
  },
  alignRight: {
    width: '35%',
    alignSelf: 'flex-end',
    marginHorizontal: 5,
    marginTop: 10
  },
  alignLeft: {
    width: '50%',
    alignSelf: 'flex-start',
    marginStart: 20,
    marginTop: 10
  },

});

export default AddMedications;
