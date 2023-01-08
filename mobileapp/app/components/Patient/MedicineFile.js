import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, Image } from 'react-native';
import { Text } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import { Grid, Row, Col } from 'react-native-paper-grid';

import { HTTP_CLIENT_URL } from '../../url';


const MedicineFile = ({ route }) => {
  //declare state variables
  // console.log(route.params.paramKey)
  const [element, setElement] = React.useState();
  const [elementt, setElementt] = React.useState("{}");
  const [patientName, setPatientName]= React.useState("");
  const [doctorName, setDoctorName]= React.useState("");
  const navigation = useNavigation();

  React.useEffect(() => {
    //get file from ipfs
    fetch(`${HTTP_CLIENT_URL}/ipfs/getFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ h: route.params.hash }),
    }).then(async res => {
      const d1 = await res.json();
      console.log(d1);

      if (d1.success) {
        const encryptedFile = d1.data;
        //decrpyt the file
        fetch(`${HTTP_CLIENT_URL}/rsa/decrypt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: route.params.paramKey,dataToDecrypt: encryptedFile }),
        }).then(async res => {
          const d1 = await res.json();
          console.log(d1);
    
          if (d1.success) {
           setElement(JSON.parse(d1.decryptedFile))
           const addressid = JSON.parse(d1.decryptedFile).patient;
            await fetch(`${HTTP_CLIENT_URL}/patient/get`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({addressid}),
            }).then(async res => {
              //On Sucessufully returning from API collect response
              console.log(res);
              const d = await res.json();
              
        
              //checking if the response has status ok
              if (d.success) {
                console.log(d);
                setPatientName(d.patient.name);


                const addressid = JSON.parse(d1.decryptedFile).doctor;
                await fetch(`${HTTP_CLIENT_URL}/doctor/get`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({addressid}),
                }).then(async res => {
                  //On Sucessufully returning from API collect response
                  console.log(res);
                  const d = await res.json();
                  
            
                  //checking if the response has status ok
                  if (d.success) {
                    console.log(d);
                    setDoctorName(d.doctor.name);
    
                    
                
                  }
                  
                });
                   
            
              }
              
            });
            
          }
        });


        
      }
    });

  }, [route]);

  React.useEffect(() => {
    setElement(JSON.parse(elementt));
  }, [elementt])


  React.useEffect(() => {
    //what to do on pressing back button
    const backAction = () => {
      navigation.goBack();
      
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])


  console.log("Element : ", element)


  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../images/appBack.jpg')} resizeMode="cover" style={{ height: '100%' }}>
        <ScrollView style={{ marginTop: 5 }}>
          <View style={{ marginLeft: 20, marginRight: 20 }}>

            <Image
              source={require('../../images/medication.jpg')}
              style={styles.image}
            />

            <Grid style={{ borderRadius: 20 }}>
              <Row style={styles.bordercolum}>
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Medicine Name:
                  </Text>
                </Col>
                <Col>
                  <Text>
                    {element?.medicine}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum}>
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Dosage:
                  </Text>
                </Col>
                <Col>
                  <Text>
                    {element?.dosage}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum} >
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    No of Days:</Text></Col>
                <Col>
                  <Text>
                    {element?.days}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum} >
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Diagnosis:
                  </Text>
                </Col>
                <Col>
                  <Text>
                    {element?.diagnosis}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum} >
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Date of Prescription:
                  </Text>
                </Col>
                <Col>
                  <Text>
                    {element?.date}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum} >
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Prescribed By:
                  </Text>
                </Col>
                <Col>
                  <Text>
                    {doctorName}
                  </Text>
                </Col>
              </Row>

            </Grid>

          </View>

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
    width: 220,
    marginEnd: 10,

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
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 20,
    width: 180,
    height: 180
  },
  bordercolum: {
    borderColor: 'black',
    minHeight: 70,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    alignContent: 'center',
    padding: 10
  },
  borderRight: {
    borderRightColor: 'black',
    minHeight: 70,
    borderRightWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  borderLeft: {
    borderLeftColor: 'black',
    minHeight: 70,
    borderLeftWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',

  }


});

export default MedicineFile;
