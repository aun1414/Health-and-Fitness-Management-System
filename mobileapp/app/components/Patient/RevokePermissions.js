import React from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text,  TextInput } from 'react-native-paper';
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

  const [loading, setLoading] = React.useState(false)

    
    React.useEffect(() => {
      getElements();
    }, [type])


  

  // React.useEffect(() => { getElements(); }, [])

  //get all files of patients for which he/she has given permission
  async function getElements() {
    const patientid =  await AsyncStorage.getItem("addressid");

    setLoading(true)

    fetch(`${HTTP_CLIENT_URL}/contracts/getPermissionedFilesByPatient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientid }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      console.log(d2);

      
        //checking if the response has status ok
      if (d2.success) {
        var tempArr=d2.files

        for(var i=0; i<tempArr.length; i++){
          const addressid=tempArr[i].doctor;
          console.log(tempArr[i])
          await fetch(`${HTTP_CLIENT_URL}/doctor/get`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({addressid}),
          }).then(async res1 => {
            //On Sucessufully returning from API collect response
            console.log("I: ",i)
            console.log("Temp: ",tempArr)
            const d = await res1.json();
            
            
      
             //checking if the response has status ok
            if (d.success) {
              
              console.log(d);
              console.log(tempArr[i])
              tempArr[i]["doctorName"]=d.doctor.name;
              
          
            }
            
          });
        }
        setElements(tempArr);
        setLoading(false)
      }
      else {
        setLoading(false)
        console.log(d2)     
    }
    });


  }


  //revoke permission on a file
  const revoke = async (element) =>{
    const patientid =  await AsyncStorage.getItem("addressid");
    const doctor = element.doctor
    const fileId=element.file
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
        getElements();
      }
      else {
        console.log(element)
        console.log("Error updating permission to blockchain")
       
    }
    });
  }

  //if patient wants to see file go to input private key of patient
  const visitFile = async (element) =>{

    const patientid =  await AsyncStorage.getItem("addressid");

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
        <ScrollView style={{ marginTop: 10 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center'
            }}>

            
          </View>

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {loading && <ActivityIndicator color={"#fff"} />}
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
                    key={element.file+element.doctor}>
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

            <Col>
              <Row style={styles.bordered2}><Text style={{ fontWeight: 'bold' }}>Doctor</Text></Row>
              {
                elements.map(element => (
                  <Row
                    style={styles.bordered1}
                    key={element.file+element.doctor}>
                    <Text>
                      {element.doctorName}
                    </Text>
                  </Row>
                )
                )}
            </Col>

            <Col>
              <Row style={styles.bordered2}><Text style={{ fontWeight: 'bold' }}>Access</Text></Row>
              {
                elements.map(element => (
                  <Row style={styles.bordered1} key={element.file+element.doctor}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', minHeight: 30, width: '90%' }} mode="contained" 
                    onPress={() => revoke(element)}>
                      <Text style={{ color: 'blue', padding: 10 }}>Revoke Access</Text>
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

  }



});

export default RevokePermissions;
