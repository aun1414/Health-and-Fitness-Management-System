import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
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


  React.useEffect(() => { getElements(); }, [search])

  //get All file hashes from smart contract tjat doctor have permission to
  async function getElements() {
    const doctorid =  await AsyncStorage.getItem("addressid");

    fetch(`${HTTP_CLIENT_URL}/contracts/getPermissionedFilesByDoctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doctorid }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      console.log(d2);
      
        //checking if the response has status ok
      if (d2.success) {

        setElements(d2.files);
        

      }
      else {
        console.log(d2)
        
    }
    });

  }

  const changed = (text) => {
    setSearch(text);
    console.log(text);

  }

  //on going to a file navigate to input private key of doctor
  const press = (element) => {
    if(element.type=="Medication"){
      navigation.navigate("InputKey", { path:"MedicineInfo", hash: element.file })
    }
    else if(element.type=="DoctorNote"){
      navigation.navigate("InputKey", { path:"DoctorNoteInfo", hash: element.file })
    }
    else if(element.type=="LabResult"){
      navigation.navigate("InputKey", { path:"LabResultInfo", hash: element.file })
    }
    else if(element.type=="BloodPressure"){
      navigation.navigate("InputKey", { path:"BloodPressureFileDoc", hash: element.file })
    }
    else if(element.type=="HeartRate"){
      navigation.navigate("InputKey", { path:"HeartRateFileDoc", hash: element.file })
    }
    else if(element.type=="Temperature"){
      navigation.navigate("InputKey", { path:"TemperatureFileDoc", hash: element.file })
    }
    
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
              marginHorizontal: 10,
              marginTop: 30
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
                      onPress={()=>press(element)} >
                      <Text
                        style={{color: 'blue', padding: 10 }}>
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
                  File Type
                </Text>
              </Row>
              {
                elements.map(element => (

                  <Row
                    style={styles.bordered1}
                    key={element.file}>
                    <Text>{element.type}</Text>
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
    minHeight: 90,
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

export default PermissionDoctor;
