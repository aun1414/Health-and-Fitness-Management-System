import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Grid, Row, Col } from 'react-native-paper-grid';
import '../../../file';
import { HTTP_CLIENT_URL } from '../../../url';


const FileSlide = (item) => {

  console.log("Item: ", item)

  //declare state variables
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
      body: JSON.stringify({ h: item.item.hash }),
    }).then(async res => {
      const d1 = await res.json();
      console.log("File from IPFS: ",d1);

      if (d1.success) {
        const encryptedFile = d1.data;
        //decrypt file
        fetch(`${HTTP_CLIENT_URL}/rsa/decrypt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: item.item.privKey, dataToDecrypt: encryptedFile }),
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

  }, [item]);

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


  console.log("Element: ", element)

  return (
    <View style={styles.container}>
     
     
        <ScrollView style={{ marginTop: 5 }}>
          <View
            style={{ marginLeft: 20, marginRight: 20 }}>

            <Image
              source={require('../../../images/labResult.jpg')}
              style={styles.image}
              resizeMode='contain'
            />

            <Grid style={{ borderRadius: 20 }}>

              <Row style={styles.bordercolum}>
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Name:
                  </Text>
                </Col>
                <Col>
                  <Text>
                    {element?.testName}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum}>
                <Col>
                <Text style={{ fontWeight: 'bold' }}>
                  Result:
                  </Text>
                  </Col>
                <Col>
                <Text>
                  {element?.result}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum}>
                <Col>
                <Text style={{ fontWeight: 'bold' }}>
                  Remark:
                  </Text>
                  </Col>
                <Col>
                <Text>
                  {element?.remark}
                  </Text>
                </Col>
              </Row>

              <Row style={styles.bordercolum}>
                <Col>
                  <Text style={{ fontWeight: 'bold' }}>
                    Date of Test:
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
                    Doctor:
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


    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#b0e0e6',
    // height: '100%',
    // width: '100%'
  },
  texfield: {
    width: 220,
    marginEnd: 10,

  },
  rows: {
    marginTop: 20
  },
  card: {
    width: '95%',
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
    width: 160,
    height: 160
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

export default FileSlide;
