import React, { useContext }  from 'react';
import { TextInput, ActivityIndicator, ScrollView, Image, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text, Button, Provider, Portal, Modal, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';
import AppContext from './AppContext';

const AddPermissionsPatient = () => {

  //declaring state variables
  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);
  const [tempelements, setTempElements] = React.useState([]);
  const [search, setSearch] = React.useState("")
  const { hideTabs, toggleTabBarVisibility } = useContext(AppContext);


  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [type, setType] = React.useState('LabResult')
  const [modalType, setmodalType] = React.useState('LabResult')
  const [checkarr, setCheckArr] = React.useState([])
  const [selected, setSelected] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  React.useEffect(() => { getElements(); }, [type])

  const changed = (text) => {
    setSearch(text);
    console.log(text);

  }

  React.useEffect(() => {
    counter = 0;

    let temp = []


    for (var i = 0; i < tempelements.length; i++) {
      console.log(tempelements)

      if (tempelements[i].fileDate.includes(search)) {
        temp.push(tempelements[i])
      }
    }

    setElements(temp)
    let tempcheckArr = new Array(temp.length).fill(false);
    setCheckArr(tempcheckArr)

  }, [search])


  //get all file hashes of patient from smartcontracts
  async function getElements() {
    setSelected(false)

    setLoading(true)
    setElements([])
    setCheckArr([])

    toggleTabBarVisibility(false);

    const patientid = await AsyncStorage.getItem("addressid");

    fetch(`${HTTP_CLIENT_URL}/contracts/getFilesbyPatientandType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientid, fileType: type }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      console.log("Add: ", d2);

      //checking if the response has status ok
      if (d2.success) {

        setLoading(false)

        setElements(d2.files);
        setTempElements(d2.files);

        let tempcheckArr = new Array(d2.files.length).fill(false);
        setCheckArr(tempcheckArr)

      }
      else {
        setLoading(false)
        console.log(d2)

      }
    });

  }



  //if patient wants to visit some file then go to input private key of patient
  const visitFile = async (element) => {

    const patientid = await AsyncStorage.getItem("addressid");

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

  const okType = () => {
    setType(modalType)
    closeMenu()
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

    if(find){
      toggleTabBarVisibility(true);
    }
    else{
      toggleTabBarVisibility(false);
    }

    


    console.log("Index: ", checkarr)
  }

  const grantAccess = () => {

    let accessArr = []

    for (let i = 0; i < checkarr.length; i++) {
      if (checkarr[i] === true) {
        accessArr.push(elements[i])
      }

    }
    navigation.navigate('GrantPermissionPatient', { paramKey: accessArr })
  }

  const VisitFiles = () => {
    let accessArr = []

    for (let i = 0; i < checkarr.length; i++) {
      if (checkarr[i] === true) {
        accessArr.push(elements[i])
      }

    }
    console.log("All Files: ", accessArr)
    navigation.navigate('InputKeySlider', { path: 'SliderPatient', files: accessArr })
  }

  const grantAccess1 = (e) => {

    let accessArr = [e]
    navigation.navigate('GrantPermissionPatient', { paramKey: accessArr })
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
                marginTop: 0,
                marginHorizontal: 10
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

              <Col size={35}>

                <Row
                  style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                    File
                  </Text>
                </Row>

                {
                  elements.map((element, index) => (

                    <Row
                      style={styles.bordered1}
                      key={element.file}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 30,
                          width: '90%'
                        }}
                      >
                        <Text style={{ padding: 10 }}
                          onLongPress={() => changeCheckValue(index)}>
                          {element?.file}
                        </Text>
                      </View>
                    </Row>

                  )
                  )}
              </Col>

              <Col size={33}>

                <Row
                  style={styles.bordered2}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Date
                  </Text>
                </Row>

                {
                  elements.map(element => (

                    <Row
                      style={styles.bordered1}
                      key={element.file}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 30,
                          width: '90%'
                        }}
                      >
                        <Text style={{ padding: 10 }}>
                          {element?.fileDate}
                        </Text>
                      </View>
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
                          onPress={() => grantAccess1(element)}>
                          <Text style={{ color: 'blue' }}>Grant Access</Text>
                        </TouchableOpacity>

                        <Text>or</Text>
                        <TouchableOpacity style={{
                          padding: 8
                        }}
                          onPress={() => visitFile(element?.file)}>
                          <Text style={{ color: 'blue' }}>View Content</Text>
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
              height: 65, backgroundColor: 'royalblue', flexDirection: 'row', justifyContent: 'space-evenly',
              alignItems: 'center'
            }}>
              <TouchableOpacity style={{ padding: 8 }} onPress={grantAccess}>
                <View style={{
                  backgroundColor: 'royalblue', flexDirection: 'column', justifyContent: 'space-evenly',
                  alignItems: 'center'
                }}>
                  <Image
                    source={require('../../images/grant.png')}
                    style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: 'white', marginTop: 5 }}>Grant Access</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 8 }} onPress={VisitFiles}>
                <View style={{
                  backgroundColor: 'royalblue', flexDirection: 'column', justifyContent: 'space-evenly',
                  alignItems: 'center'
                }}>
                  <Image
                    source={require('../../images/view.png')}
                    style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: 'white', marginTop: 5 }}>View Files</Text>
                </View>
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
    height: 60,
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
    height: 45,
    alignSelf: 'center'
  },
  cancelbutton: {
    margin: 10,

  }

});

export default AddPermissionsPatient;
