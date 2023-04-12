import * as React from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, TouchableOpacity, View, ScrollView, ImageBackground, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Portal, Provider, Modal } from 'react-native-paper';
import { HTTP_CLIENT_URL } from '../../url';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GrantPermissionPatient = ({ route }) => {
  //declare state variables
  const navigation = useNavigation();
  const [doctor, setDoctor] = React.useState("");
  const [key, setKey] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState("");
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    //what to do when back button is pressed
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])



  const grantAccess = async () => {
    if(doctor.trim()===''){
      setModalMsg("Doctor Id is required");
      setModalVisible(true);
    }
    else if(key.trim()===''){
      setModalMsg("Private Key is required");
      setModalVisible(true);

    }
    else{
    const accessArr = route.params.paramKey
    const patientid = await AsyncStorage.getItem("addressid");


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

      if (d1.success) {
        const myDoctor = d1.doctor;

        setLoading(true)

        for (let i = 0; i < accessArr.length; i++) {
          const fileId = accessArr[i].file;


          const fileIPFS1 = await fetch(`${HTTP_CLIENT_URL}/ipfs/getFile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ h: fileId }),
          })

          const fileIPFS = await fileIPFS1.json();
          console.log(fileIPFS)

          if (fileIPFS.success) {
            const encryptedFile = fileIPFS.data;
            const Reencrypted1 = await fetch(`${HTTP_CLIENT_URL}/rsa/reencrypt`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ privateKeyPatient: key, publickKeyDoctor: myDoctor.publickey, dataToReEncrypt: encryptedFile }),
            });
            console.log("File ID 1: ", Reencrypted1)
            const Reencrypted = await Reencrypted1.json();
            console.log("File ID: ", Reencrypted)
            if (Reencrypted.success) {
              const uploadedFile1 = await fetch(`${HTTP_CLIENT_URL}/ipfs/uploadFile`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file: "Permission.json", content: Reencrypted.encryptedFile }),
              })
              const uploadedFile = await uploadedFile1.json()
              if (uploadedFile.success) {
                const permissioned1 = await fetch(`${HTTP_CLIENT_URL}/contracts/grantPermission`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ patientid: patientid, doctorid: doctor, fileId: fileId, pHash: uploadedFile.hashValue }),
                })
                const permissioned = await permissioned1.json()
                if (permissioned.success) {
                  if (i === accessArr.length - 1) {
                    setLoading(false)
                    navigation.goBack();
                  }
                }
                else {
                  setLoading(false)
                  setModalMsg("Error setting permission of File in Blockchain: ", i + 1);
                  setModalVisible(true);
                }

              }
              else {
                setLoading(false)
                setModalMsg("Error uploading Reencrypted File to IPFS: ", i + 1);
                setModalVisible(true);

              }

            }
            else {
              setLoading(false)
              setModalMsg("Error Reencrypting File: ", i + 1);
              setModalVisible(true);
              break
            }
          }
          else {
            setLoading(false)
            setModalMsg("Error getting File from IPFS File: ", i + 1);
            setModalVisible(true);
            break
          }
        }


      }
      else {
        setLoading(false)
        setModalMsg("Doctor doesnot Exist");
        setModalVisible(true);
      }

  
    });
  }



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
              buttonColor='red'
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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {loading && <ActivityIndicator color={"#fff"} />}
            </View>

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
              onPress={() => { grantAccess() }}>
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