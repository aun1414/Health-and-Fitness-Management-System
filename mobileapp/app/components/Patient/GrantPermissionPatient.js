import * as React from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, View, ScrollView, ImageBackground, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Portal, Provider, Modal } from 'react-native-paper';
import { HTTP_CLIENT_URL } from '../../url';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GrantPermissionPatient = ({ route }) => {
  //declare state variables
    const navigation = useNavigation();
    const [doctor, setDoctor] = React.useState();
    const [key, setKey] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalMsg, setModalMsg] = React.useState("");
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        //what to do when back button is pressed
        const backAction = () => {
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [])


    //if patient wants to visit file then go to input private key of patient
    const visitFile = async (element) =>{

        const patientid =  await AsyncStorage.getItem("addressid");
    
        //get type of file from smart contracts
        fetch(`${HTTP_CLIENT_URL}/contracts/getFileType`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ patientid, fileId: element }),
        }).then(async res => {
          //On Sucessufully returning from API collect response
          const d2 = await res.json();
          console.log(d2);
          
            //checking if the response has status ok
          if (d2.success) {
    
            if(d2.fileType==="Medication"){
              navigation.navigate("InputKey", {  path: 'MedicineFile', hash: element })
    
            }
            else if(d2.fileType==="DoctorNote"){
              navigation.navigate("InputKey", { path: 'DoctorNoteFile', hash: element })
    
            }
            else if(d2.fileType==="LabResult"){
              navigation.navigate("InputKey", { path: 'LabResultFile', hash: element })
    
            }
            
    
          }
          else {
            console.log(d2)
            
        }
        });
    
      }

      const grantAccess = async () =>{
        const fileId=route.params.paramKey;
        const patientid =  await AsyncStorage.getItem("addressid");

        fetch(`${HTTP_CLIENT_URL}/doctor/get`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addressid: doctor }),
          }).then(async res => {
            //On Sucessufully returning from API collect response
            const d1 = await res.json();
            console.log(d1);
      
             //checking if the response has status ok
            if (d1.success) {
                const myDoctor = d1.doctor;
                fetch(`${HTTP_CLIENT_URL}/ipfs/getFile`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ h: fileId }),
                  }).then(async res => {
                    const d1 = await res.json();
                    console.log(d1);
              
                    if (d1.success) {
                      const encryptedFile = d1.data;
              
                      fetch(`${HTTP_CLIENT_URL}/rsa/reencrypt`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ privateKeyPatient: key, publickKeyDoctor: myDoctor.publickey, dataToReEncrypt: encryptedFile }),
                      }).then(async res => {
                        const d1 = await res.json();
                        console.log(d1);
                  
                        if (d1.success) {
                            fetch(`${HTTP_CLIENT_URL}/ipfs/uploadFile`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ file: "Permission.json", content: d1.encryptedFile }),
                              }).then(async res => {
                                //On Sucessufully returning from API collect response
                                const d2 = await res.json();
                                console.log(d2);
                          
                                  //checking if the response has status ok
                                if (d2.success) {
                                  fetch(`${HTTP_CLIENT_URL}/contracts/grantPermission`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ patientid: patientid, doctorid: doctor, fileId: fileId, pHash: d2.hashValue }),
                                  }).then(async res => {
                                    //On Sucessufully returning from API collect response
                                    const d = await res.json();
                                    console.log(d);
                              
                                      //checking if the response has status ok
                                    if (d.success) {
                              
                                      navigation.goBack();
                                
                                    }
                                    else {
                                      console.log("Error updating permission to blockchain")
                                     
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
                        else{
                            console.log("Error Reencrypting")
                            setModalMsg("Error Reencrypting");
                            setModalVisible(true);
                        }
                      });

                    }
                    else{
                        console.log("Error getting File from IPFS")
                        setModalMsg("Error getting File from IPFS");
                            setModalVisible(true);
                    }
                  });


            } else{
                console.log(d1);
                setModalMsg("Doctor doesnot exist");
                            setModalVisible(true);

            }
        });
        
        

      }
    //function to be called on closing modal displaying doctor note is added
    const ok = () => {
      //making ModalVisible false to hide the modal that doctor note is added
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

            <ImageBackground
                source={require('../../images/appBack.jpg')}
                resizeMode="cover"
                style={{ height: '100%' }}>
                <ScrollView
                    style={{ marginTop: 20 }}>
                    <Image
                        source={require('../../images/access.jpg')}
                        style={styles.image}
                    />

                    <TouchableOpacity
                        style={{
                            margin: 20,
                            backgroundColor: 'whitesmoke',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 30,
                            width: '90%'
                        }}
                        onPress={()=>visitFile(route.params.paramKey)}
                        >
                        <Text style={{ padding: 10, color: 'black' }}>
                            {route.params.paramKey}
                        </Text>

                    </TouchableOpacity>
                    <TextInput
                        placeholder="Doctor"
                        value={doctor}
                        onChangeText={doctor => setDoctor(doctor)}
                        style={styles.textfield}

                    />

                    <TextInput
                        placeholder="Key"
                        value={key}
                        onChangeText={key => setKey(key)}
                        style={styles.textfield}
                        multiline
                        numberOfLines={3}

                    />

                    <Button
                        buttonColor='royalblue'
                        style={styles.button}
                        mode="contained"
                        onPress={() => {grantAccess() }}>
                        <Text>
                            Grant Access
                        </Text>
                    </Button>

                   
                   
                    
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
        height: 180,
        width: 180,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 10,
    },
    textfield: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'whitesmoke',
        
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
    okbutton: {
      margin: 10,
  
    },
});


export default GrantPermissionPatient;