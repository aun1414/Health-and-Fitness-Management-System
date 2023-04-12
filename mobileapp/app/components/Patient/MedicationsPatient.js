import React from 'react';
import { ActivityIndicator ,ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import '../../file';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';


const MedicationsPatient = () => {

  //declare state variables
  var counter = 0;

  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [tempelements, setTempElements] = React.useState([]);
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    counter = 0;
    //what to do on pressing back button
    const backAction = () => {
      navigation.goBack();
      return true;


    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])



  React.useEffect(() => {
    counter = 0;
    getElements();
  }, [])

  React.useEffect(() =>{
    counter = 0;

    let temp=[]

    console.log("E",tempelements)
    console.log("E",elements)
     
    for(var i=0; i<tempelements.length; i++){
      console.log(tempelements)
      if(tempelements[i].file.includes(search)){
        temp.push(tempelements[i])
      }
    }

    setElements(temp)
    console.log("S",elements)

}, [search])

  //get all medicine files of patient from smart contracts
  async function getElements() {
    
    const patientid =  await AsyncStorage.getItem("addressid");

    fetch(`${HTTP_CLIENT_URL}/contracts/getFilesbyPatientandType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientid,fileType: "Medication" }),
    }).then(async res => {
      //On Sucessufully returning from API collect response
      const d2 = await res.json();
      console.log(d2);
      setLoading(false)
      
        //checking if the response has status ok
      if (d2.success) {

        setTempElements(d2.files)

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

  //if patient wants to see file go to input private key of patient
  const press = (element) => {
    navigation.navigate("InputKey", { path: 'MedicineInfo', hash: element })
  }


  return (
    <View style={styles.container}>
      <BackAppBar message={"Medications"} />
      <ImageBackground source={require('../../images/appBack.jpg')} resizeMode="cover" style={{ height: '100%' }}>
        <ScrollView style={{ marginTop: 70 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <TextInput
              style={styles.texfield}
              placeholder='Search...'
              mode='outlined'
              value={search}
              onChangeText={changed} />
          </View>

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              {loading && <ActivityIndicator color={"#fff"} />}
            </View>


          <Grid style={{ marginTop: 30, marginHorizontal: 10 }}>

            <Col>

              {
                elements.map(element => (

                  <Row
                    style={styles.bordered}
                    key={element.toString()}>
                    <Col
                      style={{
                        backgroundColor: 'darkgray',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      size={1}>
                      <Text
                        style={{
                          padding: 10,
                          fontSize: 18,
                          color: 'white'
                        }}>
                        {++counter}
                      </Text>
                    </Col>

                    <Col
                      style={{
                        height: '100%',
                        justifyContent: 'center'
                      }}
                      size={4}>
                      <TouchableOpacity
                        mode="contained" 
                        onPress={()=>press(element)}>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 16
                          }}>
                          {element?.file}
                        </Text>
                      </TouchableOpacity>
                    </Col>
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
    minHeight: 60,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    flex: 1

  },
  bordered: {
    minHeight: 60,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
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
export default MedicationsPatient;
