import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Card, Title, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';

const HomePatient = () => {

  //declaring state variables
  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);
  const [patientName, setPatientName] = React.useState("");

  //get patient account information from patient
  const start = async() =>{
    try{
      const addressid = await AsyncStorage.getItem("addressid");
      const response = fetch(`${HTTP_CLIENT_URL}/patient/get`, {
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
      
        }
        
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => { 
    start();
    getElements(); 
  }, [])

  async function getElements() {
    var elementsArr = [
      { key: 1, name: 'Medications', uri: require('../../images/medication.jpg'), click: 'MedicationsPatient' },
      { key: 2, name: 'Doctor Notes', uri: require('../../images/doctorNote.jpg'), click: 'DoctorNotesPatient' },
      { key: 3, name: 'Lab Results', uri: require('../../images/labResult.jpg'), click: 'LabResultsPatient' },
      { key: 4, name: 'Vital Signs', uri: require('../../images/vital.jpg'), click: 'Vitals' },
      { key: 5, name: 'Activity', uri: require('../../images/running.jpg'), click: 'Exercise' }
    ]
    setElements(elementsArr);

  }

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require('../../images/appBack.jpg')}
        resizeMode="cover"
        style={{ height: '100%' }}>
        <ScrollView>

          <Text
            style={{
              marginTop: 20,
              marginStart: 30,
              color: 'white'
            }}
            variant="headlineMedium">
            Hi {patientName}!
          </Text>
          <View style={styles.rows}>
            {
              elements.map(element => (
                <Surface
                  key={element.key}
                  style={styles.card}
                  elevation={5} >

                  <Card
                    style={styles.maincard}
                    onPress={() => navigation.navigate(element.click)}>

                    <Card.Cover
                      style={{
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                        height: 100
                      }}
                      resizeMode="contain"
                      source={element.uri} />

                    <Card.Content
                      style={{
                        height: 60,
                        justifyContent: 'center'
                      }} >

                      <Title
                        style={{
                          color: 'white',
                          alignSelf: 'center'
                        }}>
                        {element.name}
                      </Title>

                    </Card.Content>
                  </Card>
                </Surface>

              ))
            }

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
  rows: {

    margin: 10,
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  card: {
    height: 160,
    width: 165,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 30,
    textAlign: 'center'

  },
  maincard: {
    borderRadius: 30,
    backgroundColor: 'cornflowerblue'

  },


});

export default HomePatient;
