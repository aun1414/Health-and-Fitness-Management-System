import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, Provider, Portal, Modal, TextInput } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import DatePicker from 'react-native-date-picker';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';

const HeartRateFile = ({route}) => {

  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
      Scopes.FITNESS_NUTRITION_WRITE,
      Scopes.FITNESS_SLEEP_READ,
      Scopes.FITNESS_HEART_RATE_READ,
      Scopes.FITNESS_HEART_RATE_WRITE,
      Scopes.FITNESS_BODY_TEMPERATURE_READ,
      Scopes.FITNESS_BODY_TEMPERATURE_WRITE
    ],
  };

  const [date, setDate] = React.useState(new Date())

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState("");
  const [myData, setMyData] = React.useState([]);
  const [times, setTimes] = React.useState([]);
  const [heartRates, setHeartRates] = React.useState([70,80]);
  const [origHeartRates, setOrigHeartRates] = React.useState([]);
  const [patientName, setPatientName]= React.useState("");

  React.useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;


    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])

    React.useEffect(() => {
    //getting file from ipfs
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
            const d = JSON.parse(d1.decryptedFile)
            let dateString = d.date.split("/");
            console.log("Obj: ", dateString)
            let dat = new Date(dateString[2]+ '-'+ dateString[0]+ '-'+ dateString[1]);
            setMyData(d.myData)
            setDate(dat)
          //  setDate(Date.parse(d.date))
          //  console.log(date)

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
            
              }
              
            }); 
          }
        });
      }
    });

  }, [route]);


  //function to be called on closing modal 
  const ok = () => {
    //making ModalVisible false to hide the modal
    setModalVisible(false);

  }

  return (
    <Provider>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={ok}
          contentContainerStyle={styles.modalAge}>
          <View>

            <Text
              style={{ margin: 10, textAlign: 'center' }}>
              {modalMsg}
            </Text>

            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={ok}>
              Ok
            </Button>

          </View>

        </Modal>
      </Portal>
      <View style={styles.container}>
       
        <ImageBackground
          source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>

          <View style={{ marginTop: 20 }}>
           
              <View>
                
                  <TextInput
                    value={date.toDateString()}
                    style={styles.textfield}
                    editable={false}
                  />

                <LineChart
                  data={{
                    labels: myData.map((item) =>
                      new Date(item.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                    ),
                    datasets: [
                      {
                        data: myData.map((item) => item.value)
                      },
                      {
                        data: [Math.min(...heartRates)-5],
                        withDots: false
                      },
                      {
                        data: [Math.max(...heartRates)+5],
                        withDots: false
                      }
                    ]
                  }}
                  width={Dimensions.get("window").width - 20} // from react-native
                  height={220}
                  yAxisSuffix="bpm"
                  yAxisInterval={1} // optional, defaults to 1

                  withShadow={false}
                  withInnerLines={false}
                  withOuterLines={false}
                  chartConfig={{
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '3',
                      strokeWidth: '2',
                      stroke: '#FF4500',
                    },

                  }}
                  bezier
                  style={{
                    marginVertical: 10,
                    marginHorizontal: 12,
                  }}

                />

                <View style={styles.rowline}>
                  <TouchableOpacity
                    onPress={()=> navigation.navigate('DataHeartRate', {date: date.toLocaleDateString(),element: myData})}
                  >
                    <Text
                      style={styles.linktext}
                    >
                      See All Data
                    </Text>

                  </TouchableOpacity>

                 
                </View>

              </View>

          </View>


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
  rows: {
    marginTop: 80

  },
  button: {
    margin: 20,
  },
  linktext: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
  },
  rowline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  card: {
    width: '90%',
    height: 90,
    margin: '5%',
    borderRadius: 20,
    textAlign: 'center'

  },
  modalAge: {
    backgroundColor: 'white',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
    borderRadius: 10

  },
  maincard: {
    borderRadius: 20,
    height: 90,
    backgroundColor: 'whitesmoke',

  },
  okbutton: {
    margin: 10,

  },
  textfield: {
    marginHorizontal: 10,
    textAlign: 'center',
    backgroundColor: 'white'
  }

});

export default HeartRateFile;


// import React from 'react';
// import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, Image } from 'react-native';
// import { Text } from 'react-native-paper';
// import BackAppBar from '../BackAppBar';
// import { useNavigation } from '@react-navigation/native';
// import { Grid, Row, Col } from 'react-native-paper-grid';
// import '../../file';
// import { HTTP_CLIENT_URL } from '../../url';


// const HeartRateFile = ({ route }) => {

//   //declaring state variables

//   const [element, setElement] = React.useState();
//   const [elementt, setElementt] = React.useState("{}");
//   const [patientName, setPatientName]= React.useState("");
//   const navigation = useNavigation();

//   React.useEffect(() => {
//     //getting file from ipfs
//     fetch(`${HTTP_CLIENT_URL}/ipfs/getFile`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ h: route.params.hash }),
//     }).then(async res => {
//       const d1 = await res.json();
//       console.log(d1);

//       if (d1.success) {
//         const encryptedFile = d1.data;

//         fetch(`${HTTP_CLIENT_URL}/rsa/decrypt`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ key: route.params.paramKey,dataToDecrypt: encryptedFile }),
//         }).then(async res => {
//           const d1 = await res.json();
//           console.log(d1);
    
//           if (d1.success) {
//            setElement(JSON.parse(d1.decryptedFile))

//            const addressid = JSON.parse(d1.decryptedFile).patient;
//             await fetch(`${HTTP_CLIENT_URL}/patient/get`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({addressid}),
//             }).then(async res => {
//               //On Sucessufully returning from API collect response
//               console.log(res);
//               const d = await res.json();
              
        
//               //checking if the response has status ok
//               if (d.success) {
//                 console.log(d);
//                 setPatientName(d.patient.name);
            
//               }
              
//             });
            
//           }
//         });


        
//       }
//     });

//   }, [route]);

//   React.useEffect(() => {
//     setElement(JSON.parse(elementt));
//   }, [elementt])




//   React.useEffect(() => {

//     const backAction = () => {
//       navigation.goBack();
//       return true;
//     };
//     const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
//     return () => backHandler.remove();
//   }, [])

//   console.log("Element: ", element)

//   return (
//     <View style={styles.container}>
     

//       <ImageBackground
//         source={require('../../images/appBack.jpg')}
//         resizeMode="cover"
//         style={{ height: '100%' }}>

//         <ScrollView style={{ marginTop: 5 }}>

//           <View
//             style={{
//               marginLeft: 20,
//               marginRight: 20
//             }}>

//             <Image
//               source={require('../../images/vital.jpg')}
//               style={styles.image}
//               resizeMode='contain'
//             />

//             <Grid style={{ borderRadius: 20 }}>

//             <Row style={styles.bordercolum} >
//                 <Col>
//                   <Text style={{ fontWeight: 'bold' }}>
//                     Patient:
//                   </Text>
//                 </Col>
//                 <Col>
//                   <Text>
//                     {patientName}
//                   </Text>
//                 </Col>
//               </Row>

              
//               <Row style={styles.bordercolum}>

//                 <Col>
//                   <Text style={{ fontWeight: 'bold' }}>
//                     Date :
//                   </Text>
//                 </Col>

//                 <Col>
//                   <Text>
//                     {element?.date}
//                   </Text>
//                 </Col>
                
//               </Row>

//               <Row style={styles.bordercolum}>

//                 <Col>
//                   <Text style={{ fontWeight: 'bold' }}>
//                   Avg HeartRate :
//                   </Text>
//                 </Col>

//                 <Col>
//                   <Text>
//                     {element?.avgHeartRate}
//                   </Text>
//                 </Col>
                
//               </Row>
           

//             </Grid>

//           </View>

//         </ScrollView>
//       </ImageBackground>

//     </View>
//   );

// };

// const styles = StyleSheet.create({
//   container: {
//     // backgroundColor: '#b0e0e6',
//     height: '100%'
//   },
//   texfield: {
//     width: 220,
//     marginEnd: 10,

//   },
//   rows: {
//     marginTop: 20
//   },
//   card: {
//     width: '90%',
//     marginHorizontal: '5%',
//     marginVertical: 10,
//     borderRadius: 20,
//     textAlign: 'center',

//   },
//   maincard: {
//     borderRadius: 20,
//     backgroundColor: 'whitesmoke',

//   },
//   image: {
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     marginTop: 30,
//     marginBottom: 20,
//     borderRadius: 20,
//     width: 180,
//     height: 180
//   },
//   bordercolum: {
//     borderColor: 'black',
//     minHeight: 70,
//     borderWidth: 1,
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     alignItems: 'center',
//     alignContent: 'center',
//     padding: 10
//   },
//   borderRight: {
//     borderRightColor: 'black',
//     minHeight: 70,
//     borderRightWidth: 1,
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     alignItems: 'center',
//   },
//   borderLeft: {
//     borderLeftColor: 'black',
//     minHeight: 70,
//     borderLeftWidth: 1,
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     alignItems: 'center',

//   }


// });

// export default HeartRateFile;

