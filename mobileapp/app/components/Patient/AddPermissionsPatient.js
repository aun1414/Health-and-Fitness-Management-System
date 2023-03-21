import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';



const AddPermissionsPatient = () => {

  //declaring state variables
  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);
  const [tempelements, setTempElements] = React.useState([]);
  const [search, setSearch] = React.useState('');

 

  React.useEffect(() => { getElements(); }, [elements])

    //get all file hashes of patient from smartcontracts
  async function getElements() {
    const patientid =  await AsyncStorage.getItem("addressid");

    fetch(`${HTTP_CLIENT_URL}/contracts/getFilesByPatient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientid }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      // console.log(d2);
      
        //checking if the response has status ok
      if (d2.success) {

        setElements(d2.files);
        setTempElements(d2.files);
        

      }
      else {
        console.log(d2)
        
    }
    });

  }

  const changed = (text) => {
    setSearch(text);
    console.log(tempelements.length);
    

   

  }

  //if patient wants to visit some file then go to input private key of patient
  const visitFile = async (element) =>{

    const patientid =  await AsyncStorage.getItem("addressid");

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

  return (
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

            <TextInput
              style={styles.texfield}
              placeholder='Search...'
              mode='outlined'
              value={search}
              onChangeText={changed} />

          </View>

          <Grid
            style={{
              marginTop: 30,
              marginHorizontal: 10
            }}>

            <Col>

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
                    key={element.file}>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 30,
                        width: '90%'
                      }}
                      mode="contained"
                      onPress={() => visitFile(element)}>
                      <Text style={{ padding: 10 }}>
                        {element}
                      </Text>
                    </TouchableOpacity>
                  </Row>

                )
                )}
            </Col>

            <Col>
              <Row style={styles.bordered2}><Text style={{ fontWeight: 'bold' }}>Access</Text></Row>
              {
                elements.map(element => (
                  <Row
                    style={styles.bordered1}
                    key={element.file}>

                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 30,
                        width: '90%'
                      }}
                      mode="contained"
                      onPress={() => navigation.navigate('GrantPermissionPatient', { paramKey: element })}>

                      <Text
                        style={{
                          color: 'blue',
                          padding: 10
                        }}>
                        Grant Access
                      </Text>
                      
                    </TouchableOpacity>
                  </Row>

                )
                )}
            </Col>

          </Grid>
        </ScrollView>
      </ImageBackground>

    </View>
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
    minHeight: 95,
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

  }


});

export default AddPermissionsPatient;
