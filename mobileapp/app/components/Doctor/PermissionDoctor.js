import React from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text, TextInput, Portal, Provider, Modal, Button, RadioButton } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';

const PermissionDoctor = () => {

  //declaring state variables
  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [type, setType] = React.useState('LabResult')
  const [modalType, setmodalType] = React.useState('LabResult')
  const [loading, setLoading] = React.useState(false)
  const [tempelements, setTempElements] = React.useState([]);

  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);


  React.useEffect(() => {
    setElements([])
    getElements();
  }, [type])

  React.useEffect(() => {
    counter = 0;

    let temp = []
    for (var i = 0; i < tempelements.length; i++) {
      console.log(tempelements)
      if (tempelements[i].patientName.includes(search)) {
        temp.push(tempelements[i])
      }
    }

    setElements(temp)


  }, [search])

  //get All file hashes from smart contract tjat doctor have permission to
  async function getElements() {

    setLoading(true)

    const doctorid = await AsyncStorage.getItem("addressid");

    fetch(`${HTTP_CLIENT_URL}/contracts/getPermissionedFilesByDoctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doctorid, fileType: type }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      console.log(d2);

      //checking if the response has status ok
      if (d2.success) {
        var tempArr = d2.files

        for (var i = 0; i < tempArr.length; i++) {
          const addressid = tempArr[i].patient;
          console.log(tempArr[i])
          await fetch(`${HTTP_CLIENT_URL}/patient/get`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addressid }),
          }).then(async res1 => {
            //On Sucessufully returning from API collect response
            console.log("I: ", i)
            console.log("Temp: ", tempArr)
            const d = await res1.json();



            //checking if the response has status ok
            if (d.success) {

              console.log(d);
              console.log(tempArr[i])
              tempArr[i]["patientName"] = d.patient.name;




            }

          });
        }
        setLoading(false)
        setElements(tempArr);
        setTempElements(tempArr)


      }
      else {
        console.log(d2)

      }
    });

  }

  const okType = () => {
    setType(modalType)
    closeMenu()
  }

  const changed = (text) => {
    setSearch(text);
    console.log(text);

  }

  //on going to a file navigate to input private key of doctor
  const press = (element) => {
    if (element.type == "Medication") {
      navigation.navigate("InputKey", { path: "MedicineInfo", hash: element.file })
    }
    else if (element.type == "DoctorNote") {
      navigation.navigate("InputKey", { path: "DoctorNoteInfo", hash: element.file })
    }
    else if (element.type == "LabResult") {
      navigation.navigate("InputKey", { path: "LabResultInfo", hash: element.file })
    }
    else if (element.type == "BloodPressure") {
      navigation.navigate("InputKey", { path: "BloodPressureFileDoc", hash: element.file })
    }
    else if (element.type == "HeartRate") {
      navigation.navigate("InputKey", { path: "HeartRateFileDoc", hash: element.file })
    }
    else if (element.type == "Temperature") {
      navigation.navigate("InputKey", { path: "TemperatureFileDoc", hash: element.file })
    }

  }



  return (
    <Provider>
      <Portal>
        <Modal
          visible={visibleMenu}
          onDismiss={closeMenu}
          contentContainerStyle={styles.modalAge}>
          <ScrollView>

            <RadioButton.Group
              onValueChange={value => setmodalType(value)}
              value={modalType}>
              <RadioButton.Item label="Medication" value="Medication" />
              <RadioButton.Item label="Lab Result" value="LabResult" />
              <RadioButton.Item label="Doctor Note" value="DoctorNote" />
              <RadioButton.Item label="Heart Rate" value="HeartRate" />
              <RadioButton.Item label="Blood Pressure" value="BloodPressure" />
              <RadioButton.Item label="Temperature" value="Temperature" />

            </RadioButton.Group>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okType}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={closeMenu}>
              Cancel
            </Button>

          </ScrollView>


        </Modal>
      </Portal>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>
          <ScrollView
            style={{ marginTop: 10 }}>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center'
              }}>

              <TouchableOpacity
                onPress={openMenu}>
                <TextInput
                  value={type}
                  style={styles.textfield}
                  editable={false}
                />

              </TouchableOpacity>

            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center'
              }}>

              <TextInput
                style={styles.texfield}
                placeholder='Patient...'
                mode='outlined'
                value={search}
                onChangeText={changed} />
            </View>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {loading && <ActivityIndicator color={"#fff"} />}
            </View>


            <Grid
              style={{
                marginHorizontal: 10,
                marginTop: 10
              }}>

              <Col>
                <Row style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                    File
                  </Text>
                </Row>

                {
                  elements.map(element => (
                    <Row style={styles.bordered1} key={element.file}>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 30,
                          width: '90%'
                        }}
                        mode="contained"
                        onPress={() => press(element)} >
                        <Text
                          style={{ color: 'blue', padding: 10 }}>
                          {element.file}
                        </Text>
                      </TouchableOpacity>
                    </Row>



                  )
                  )}
              </Col>

              <Col>
                <Row
                  style={styles.bordered2}>
                  <Text
                    style={{ fontWeight: 'bold' }}>
                    File Date
                  </Text>
                </Row>
                {
                  elements.map(element => (

                    <Row
                      style={styles.bordered1}
                      key={element.file}>
                      <Text>{element.date}</Text>
                    </Row>

                  )
                  )}
              </Col>

              <Col>
                <Row
                  style={styles.bordered2}>
                  <Text
                    style={{ fontWeight: 'bold' }}>
                    Patient
                  </Text>
                </Row>
                {
                  elements.map(element => (

                    <Row
                      style={styles.bordered1}
                      key={element.file}>
                      <Text>{element.patientName}</Text>
                    </Row>

                  )
                  )}
              </Col>

            </Grid>

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
  texfield: {
    marginHorizontal: '2%',
    backgroundColor: 'white',
    width: '90%'

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
  bordered1: {
    borderColor: 'lightgray',
    minHeight: 120,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    flex: 1

  },
  bordered2: {
    borderColor: 'lightgray',
    minHeight: 60,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'lightblue',

    alignItems: 'center'

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
  textfield: {
    marginHorizontal: '2%',
    textAlign: 'center',
    backgroundColor: 'white',
    width: '90%'
  },
  cancelbutton: {
    margin: 10,

  }


});

export default PermissionDoctor;
