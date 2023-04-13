import React from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text, TextInput, Provider, Portal, Modal, RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

const RevokePermissions = () => {

  //declare state variables
  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);
  const [type, setType] = React.useState('LabResult')
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [modalType, setmodalType] = React.useState('LabResult')
  const [checkarr, setCheckArr] = React.useState([])
  const [selected, setSelected] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [tempelements, setTempElements] = React.useState([]);

  const [loading, setLoading] = React.useState(false)

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  React.useEffect(() => {
    counter = 0;

    let temp = []


    for (var i = 0; i < tempelements.length; i++) {
      console.log(tempelements)
      if (tempelements[i].doctorName.includes(search)) {
        temp.push(tempelements[i])
      }
    }

    setElements(temp)
    let tempcheckArr = new Array(temp.length).fill(false);
        setCheckArr(tempcheckArr)

  }, [search])

  const changed = (text) => {
    setSearch(text);
    console.log(text);

  }


  React.useEffect(() => {
    setElements([])
    setCheckArr([])
    getElements();
  }, [type])




  // React.useEffect(() => { getElements(); }, [])

  //get all files of patients for which he/she has given permission
  async function getElements() {
    setSelected(false)

    setLoading(true)

    const patientid = await AsyncStorage.getItem("addressid");


    fetch(`${HTTP_CLIENT_URL}/contracts/getPermissionedFilesByPatient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientid, fileType: type }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      console.log(d2);


      //checking if the response has status ok
      if (d2.success) {
        var tempArr = d2.files

        for (var i = 0; i < tempArr.length; i++) {
          const addressid = tempArr[i].doctor;
          console.log(tempArr[i])
          await fetch(`${HTTP_CLIENT_URL}/doctor/get`, {
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
              tempArr[i]["doctorName"] = d.doctor.name;




            }

          });
        }
        let tempcheckArr = new Array(d2.files.length).fill(false);
        setCheckArr(tempcheckArr)
        setTempElements(tempArr)
        setElements(tempArr);
        setLoading(false)
      }
      else {
        setLoading(false)
        console.log(d2)
      }
    });


  }

  const okType = () => {
    setType(modalType)
    closeMenu()
  }

  // //revoke permission on a file
  // const revoke = async (element) => {
  //   const patientid = await AsyncStorage.getItem("addressid");
  //   const doctor = element.doctor
  //   const fileId = element.file
  //   fetch(`${HTTP_CLIENT_URL}/contracts/revokePermission`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ patientid: patientid, doctorid: doctor, fileId: fileId }),
  //   }).then(async res => {
  //     //On Sucessufully returning from API collect response
  //     const d = await res.json();
  //     console.log(d);

  //     //checking if the response has status ok
  //     if (d.success) {
  //       getElements();
  //     }
  //     else {
  //       console.log(element)
  //       console.log("Error updating permission to blockchain")

  //     }
  //   });
  // }

  const revokeAccess = async () => {
    let accessArr = []

    for (let i = 0; i < checkarr.length; i++) {
      if (checkarr[i] === true) {
        accessArr.push(elements[i])
      }

    }
    const patientid = await AsyncStorage.getItem("addressid");
    for (let i = 0; i < accessArr.length; i++) {
      const element = accessArr[i]

      console.log(element)

      const doctor = element.doctor
      const fileId = element.file

      setLoading(true)
      fetch(`${HTTP_CLIENT_URL}/contracts/revokePermission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientid: patientid, doctorid: doctor, fileId: fileId }),
      }).then(async res => {
        //On Sucessufully returning from API collect response
        const d = await res.json();
        console.log(d);

        //checking if the response has status ok
        if (d.success) {

          if (i === accessArr.length - 1) {
            getElements();
          }
        }
        else {
          setLoading(false)
          console.log(element)
          console.log("Error updating permission to blockchain")

        }
      });
    }
  }

  //if patient wants to see file go to input private key of patient
  const visitFile = async (element) => {

    const patientid = await AsyncStorage.getItem("addressid");

    //get file type from smart contracts
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

        if (d2.fileType.startsWith("Medication")) {
          navigation.navigate("InputKey", { path: 'MedicineFile', hash: element })

        }
        else if (d2.fileType.startsWith("DoctorNote")) {
          navigation.navigate("InputKey", { path: 'DoctorNoteFile', hash: element })

        }
        else if (d2.fileType.startsWith("LabResult")) {
          navigation.navigate("InputKey", { path: 'LabResultFile', hash: element })

        }
        else if (d2.fileType.startsWith("BloodPressure")) {
          navigation.navigate("InputKey", { path: 'BloodPressureFile', hash: element })

        }
        else if (d2.fileType.startsWith("HeartRate")) {
          navigation.navigate("InputKey", { path: 'HeartRateFile', hash: element })

        }
        else if (d2.fileType.startsWith("Temperature")) {
          navigation.navigate("InputKey", { path: 'TemperatureFile', hash: element })

        }


      }
      else {
        console.log(d2)

      }
    });
  }

  const changeCheckValue = (i) => {
    let arr = checkarr
    if (arr[i] === false) {
      arr[i] = true
    }
    else {
      arr[i] = false
    }
    setCheckArr([...arr])

    let find = false
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === true) {
        find = true
        break
      }

    }
    setSelected(find)

    console.log("Index: ", checkarr)
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
          <ScrollView style={{ marginTop: 10 }}>
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
                  style={styles.texfield}
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
                placeholder='Doctor...'
                mode='outlined'
                value={search}
                onChangeText={changed} />
            </View>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {loading && <ActivityIndicator color={"#fff"} />}
            </View>

            <Grid
              style={{
                marginTop: 10,
                marginHorizontal: 10
              }}>
              <Col size={15}>

                <Row
                  style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                  </Text>
                </Row>

                {
                  checkarr.map((checked, index) => (
                    <Row
                      style={styles.bordered1}
                      key={index}>
                      <TouchableOpacity onPress={() => changeCheckValue(index)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: checkarr[index] ? '#007AFF' : '#C7C7CC',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 10,
                            }}>


                            {checkarr[index] && (
                              <View
                                style={{
                                  height: 14,
                                  width: 14,
                                  borderRadius: 7,
                                  backgroundColor: '#007AFF',
                                }}
                              >
                              </View>
                            )}
                          </View>

                        </View>
                      </TouchableOpacity>

                    </Row>
                  )
                  )}
              </Col>
              <Col size={40}>
                <Row
                  style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                    File
                  </Text>
                </Row>

                {
                  elements.map(element => (

                    <Row
                      style={styles.bordered1}
                      key={element.file + element.doctor}>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 30,
                          width: '90%'
                        }}
                        mode="contained"
                        onPress={() => visitFile(element.file)}
                      >
                        <Text style={{ padding: 10 }}>{element.file}</Text>
                      </TouchableOpacity>
                    </Row>

                  )
                  )}
              </Col>

              <Col size={35}>
                <Row style={styles.bordered2}><Text style={{ fontWeight: 'bold' }}>Doctor</Text></Row>
                {
                  elements.map(element => (
                    <Row
                      style={styles.bordered1}
                      key={element.file + element.doctor}>
                      <Text>
                        {element.doctorName}
                      </Text>
                    </Row>
                  )
                  )}
              </Col>

              <Col size={35}>
                <Row style={styles.bordered2}><Text style={{ fontWeight: 'bold' }}>Date</Text></Row>
                {
                  elements.map(element => (
                    <Row
                      style={styles.bordered1}
                      key={element.file + element.doctor}>
                      <Text>
                        {element.fileDate}
                      </Text>
                    </Row>
                  )
                  )}
              </Col>

            </Grid>
          </ScrollView>
          {selected &&
            <View style={{
              height: 40, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-evenly',
              alignItems: 'center'
            }}>
              <TouchableOpacity style={{ borderColor: 'blue', borderWidth: 2, padding: 8 }} onPress={revokeAccess}>
                <Text style={{ color: 'blue' }}>Revoke Permissions</Text>
              </TouchableOpacity>
            
            </View>

          }
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
    minHeight: 150,
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
  },
  texfield: {
    marginHorizontal: '2%',
    backgroundColor: 'white',
    width: '90%'
  },


});

export default RevokePermissions;
