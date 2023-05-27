import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Grid, Row, Col } from 'react-native-paper-grid';
import { LineChart } from 'react-native-chart-kit';
import '../../../file';
import { HTTP_CLIENT_URL } from '../../../url';
import BackAppBar from '../../BackAppBar';


const FileSlideDoctor = (item) => {

  console.log("Item: ", item)

  const type = item.item.hash.type

  //declare state variables
  const [element, setElement] = React.useState();
  const [elementt, setElementt] = React.useState("{}");
  const [patientName, setPatientName] = React.useState("");
  const [doctorName, setDoctorName] = React.useState("");
  const [date, setDate] = React.useState(new Date())
  const [myData, setMyData] = React.useState([]);
  const [diastolic, setDiastolic] = React.useState([70]);
  const [systolic, setSystolic] = React.useState([120]);
  const [heartRates, setHeartRates] = React.useState([70, 80]);
  const [temperatures, setTemperatures] = React.useState([30, 40]);

  const navigation = useNavigation();

  React.useEffect(() => {
    //get file from ipfs
    fetch(`${HTTP_CLIENT_URL}/ipfs/getFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ h: item.item.hash.file }),
    }).then(async res => {
      const d1 = await res.json();
      console.log("File from IPFS: ", d1);

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
            const d = JSON.parse(d1.decryptedFile)

            console.log(d)

            if (d.date) {
              let dateString = d.date.split("/");
              console.log("Obj: ", dateString)
              let dat = new Date(dateString[2] + '-' + dateString[0] + '-' + dateString[1]);
              console.log(date, myData)
              setDate(dat)

            }

            console.log("Setting Data", d.myData)

            setMyData(d.myData)

            console.log("Set ", date, myData)


            const addressid = JSON.parse(d1.decryptedFile).patient;
            console.log(addressid)
            if (addressid) {
              await fetch(`${HTTP_CLIENT_URL}/patient/get`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ addressid }),
              }).then(async res => {
                //On Sucessufully returning from API collect response
                console.log(res);
                const d = await res.json();


                //checking if the response has status ok
                if (d.success) {
                  console.log(d);
                  setPatientName(d.patient.name);
                  console.log("Set1 ", date, myData)


                  const addressid = JSON.parse(d1.decryptedFile).doctor;
                  console.log(addressid)
                  if (addressid) {
                    await fetch(`${HTTP_CLIENT_URL}/doctor/get`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ addressid }),
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


                }

              });
            }

          }
        });



      }
    });

  }, []);

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


  return (
    <View style={styles.container}>

      {
        type == "LabResult" &&

        <View>
          <BackAppBar message={"Lab Result Details"} />

          <ScrollView style={{ marginTop: 70 }}>
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
      }
      {
        type == "DoctorNote" &&
        <View>
          <BackAppBar message={"Doctor Note Details"} />
          <ScrollView style={{ marginTop: 70 }}>

            <View
              style={{
                marginLeft: 20,
                marginRight: 20
              }}>

              <Image
                source={require('../../../images/doctorNote.jpg')}
                style={styles.image}
                resizeMode='contain'
              />

              <Grid style={{ borderRadius: 20 }}>

                <Row style={styles.bordercolum}>

                  <Col>
                    <Text style={{ fontWeight: 'bold' }}>
                      Note:
                    </Text>
                  </Col>

                  <Col>
                    <Text>
                      {element?.doctorNote}
                    </Text>
                  </Col>

                </Row>

                <Row style={styles.bordercolum}>

                  <Col>
                    <Text style={{ fontWeight: 'bold' }}>
                      Visit Reason:
                    </Text>
                  </Col>

                  <Col>
                    <Text>
                      {element?.visitReason}
                    </Text>
                  </Col>

                </Row>

                <Row style={styles.bordercolum}>

                  <Col>
                    <Text style={{ fontWeight: 'bold' }}>
                      Date of Visit:
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
      }
      {
        type == "Medication" &&
        <View>
          <BackAppBar message={"Medication Details"} />
          <ScrollView style={{ marginTop: 70 }}>
            <View style={{ marginLeft: 20, marginRight: 20 }}>

              <Image
                source={require('../../../images/medication.jpg')}
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
        </View>
      }
      {
        type == "BloodPressure" &&
        <View>
          <BackAppBar message={"Blood Pressure Details"} />
          <View style={{ marginTop: 90 }}>
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
                      data: myData.map((item) => item.systolic)
                    },
                    {
                      data: myData.map((item) => item.diastolic)
                    },
                    {
                      data: [Math.min(...diastolic) - 5],
                      withDots: false
                    },
                    {
                      data: [Math.max(...systolic) - 5],
                      withDots: false
                    }
                  ]
                }}
                width={Dimensions.get("window").width - 20} // from react-native
                height={220}
                yAxisSuffix="mHg"
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
                  onPress={() => navigation.navigate('BloodPressureData', { date: date.toLocaleDateString(), element: myData })}>
                  <Text
                    style={styles.linktext}>
                    See All Data
                  </Text>

                </TouchableOpacity>


              </View>


            </View>


          </View>
        </View>
      }
      {
        type == "HeartRate" &&
        <View>
          <BackAppBar message={"Heart Rate Details"} />
          <View style={{ marginTop: 90 }}>
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
                      data: [Math.min(...heartRates) - 5],
                      withDots: false
                    },
                    {
                      data: [Math.max(...heartRates) + 5],
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
                  onPress={() => navigation.navigate('HeartRateData', { date: date.toLocaleDateString(), element: myData })}>
                  <Text
                    style={styles.linktext}>
                    See All Data
                  </Text>

                </TouchableOpacity>


              </View>


            </View>


          </View>
        </View>

      }
      {
        type == "Temperature" && 
        <View>

        <BackAppBar message={"Temperature Details"} />
        
        <View style={{ marginTop: 20 }}>

          
            <TextInput
              value={date.toDateString()}
              style={styles.textfield}
              editable={false}
            />



            <LineChart
              data={{
                labels:
                  myData.map((item) => new Date(item.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })),
                datasets: [
                  {
                    data: myData.map((item) => item.value)
                  },
                  {
                    data: [Math.min(...temperatures) - 5],
                    withDots: false
                  },
                  {
                    data: [Math.max(...temperatures) + 5],
                    withDots: false
                  }
                ]
              }}
              width={Dimensions.get("window").width - 20} // from react-native
              height={220}
              yAxisSuffix="°C"
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

            <View
              style={{
                borderBottomColor: 'white',
                margin: 5,
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />

            <View style={styles.rowline}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TemperatureData', { date: date.toLocaleDateString(), element: myData })}
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
      }






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
    marginHorizontal: 10,
    textAlign: 'center',
    backgroundColor: 'white'
  }


});

export default FileSlideDoctor;
