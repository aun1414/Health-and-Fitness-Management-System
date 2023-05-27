import React from 'react';
import { ActivityIndicator, TextInput, ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity, Image } from 'react-native';
import { Text, Portal, Provider, Modal, Button, RadioButton } from 'react-native-paper';
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
  const [checkarr, setCheckArr] = React.useState([])
  const [selected, setSelected] = React.useState(false)
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
      else if (tempelements[i].date.includes(search)) {
        temp.push(tempelements[i])
      }
    }

    setElements(temp)
    let tempcheckArr = new Array(temp.length).fill(false);
    setCheckArr(tempcheckArr)


  }, [search])

  //get All file hashes from smart contract tjat doctor have permission to
  async function getElements() {

    setLoading(true)
    setElements([])
    setCheckArr([])
    setSelected(false)

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
        let tempcheckArr = new Array(d2.files.length).fill(false);
        setCheckArr(tempcheckArr)


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
  const visitFile = (element) => {
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

  const VisitFiles = () => {
    let accessArr = []

    for (let i = 0; i < checkarr.length; i++) {
      if (checkarr[i] === true) {
        accessArr.push(elements[i])
      }

    }
    console.log("All Files: ", accessArr)
    navigation.navigate('InputKeySlider', { path: 'SliderDoctor', files: accessArr })
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
          <ScrollView
            style={{ marginTop: 10 }}>



            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  width: '94%',
                  borderBottomStartRadius: 30,
                  borderBottomEndRadius: 30,
                  borderTopEndRadius: 30,
                  borderTopStartRadius: 30,
                  height: 44
                }}>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    paddingLeft: 30
                  }}
                >
                  <TouchableOpacity
                    onPress={openMenu}>
                    {/* <Text style={styles.textfield}>{type}</Text> */}
                    <Text
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        fontSize: 16,
                        color: 'black',
                        paddingLeft: 10
                      }}

                    >{type}</Text>


                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    alignSelf: 'flex-end',
                    paddingRight: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 13
                  }}
                >



                  <TouchableOpacity
                    onPress={openMenu}>
                    <Image
                      source={require('../../images/drop-down.png')}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>

                </View>




              </View>
            </View>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
              {loading && <ActivityIndicator color={"#fff"} />}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                borderColor: 'lightgray',
                height: 50,
                borderWidth: 1,
                backgroundColor: 'lightblue',
                marginHorizontal: 10,
                marginTop: 20
              }}>

              <TextInput
                style={{
                  width: 240,
                  height: 35,
                  marginRight: 5,
                  marginTop: 5,
                  marginBottom: 5,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  paddingHorizontal: 20,
                  paddingVertical: 0,
                  fontSize: 14,
                  backgroundColor: '#fff',

                }}
                placeholder='Search...'
                mode='outlined'
                value={search}
                onChangeText={changed} />
            </View>




            <Grid
              style={{
                marginHorizontal: 10,
                marginTop: 0
              }}>

              {selected &&

                <Col size={12}>

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
              }

              <Col size={40}>
                <Row style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                    File
                  </Text>
                </Row>

                {
                  elements.map((element, index) => (
                    <Row style={styles.bordered1} key={element.file}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 30,
                          width: '90%'
                        }}
                      >
                        <Text
                          style={{ padding: 10 }}
                          onLongPress={() => changeCheckValue(index)}>
                          {element?.file}
                        </Text>
                      </View>
                    </Row>



                  )
                  )}
              </Col>

              <Col size={35}>
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

              <Col size={35}>
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

              {!selected && <Col size={34}>

                <Row
                  style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Actions
                  </Text>
                </Row>

                {
                  elements.map(element => (

                    <Row
                      style={styles.bordered1}
                      key={element.file}>
                      <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                      }}>

                        <TouchableOpacity style={{
                          padding: 8
                        }}
                          onPress={() => visitFile(element)}>
                          <Text style={{ color: 'blue' }}>View File</Text>
                        </TouchableOpacity>

                      </View>

                    </Row>

                  )
                  )}
              </Col>
              }

            </Grid>

          </ScrollView>
          {selected &&
            <View style={{
              height: 40, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-evenly',
              alignItems: 'center'
            }}>
              <TouchableOpacity style={{ borderColor: 'blue', borderWidth: 2, padding: 8 }} onPress={VisitFiles}>
                <Text style={{ color: 'blue' }}>View Files</Text>
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
    marginHorizontal: '3%',

    backgroundColor: 'white',
    width: '94%',
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    height: 45

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
    minHeight: 190,
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
    marginHorizontal: '3%',
    textAlign: 'center',
    backgroundColor: 'white',
    width: '94%',
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    height: 48
  },
  cancelbutton: {
    margin: 10,

  }


});

export default PermissionDoctor;
