import React from 'react';
import { ActivityIndicator ,ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, Provider, Portal, Modal, TextInput } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import DatePicker from 'react-native-date-picker';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';

const Temperature = () => {

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
  const [open, setOpen] = React.useState(false)

  const navigation = useNavigation();
  const [fitAuthorized, setFitAuthorized] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState("");
  const [myData, setMyData] = React.useState([]);
  const [times, setTimes] = React.useState([]);
  const [temperatures, setTemperatures] = React.useState([30, 40]);
  const [origTemperatures, setOrigTemperatures] = React.useState([]);
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;


    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])

  React.useEffect(() => {
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      if (authorized) {
        // if already authorized
        setFitAuthorized("Authorized")

      } else {
        // if not authorized
        setFitAuthorized("Not Authorized")
        setModalVisible(true);
        setModalMsg("App not Connected!")

      }

    });
  }, [fitAuthorized]);

  React.useEffect(() => {
    setLoading(true)
    GoogleFit.checkIsAuthorized().then(async () => {
      var currDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      var lastDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()+1,
      );

      const opt = {
        startDate: currDate.toISOString(), // required ISO8601Timestamp
        endDate: lastDate.toISOString(), // required ISO8601Timestamp
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };
      var authorized = GoogleFit.isAuthorized;
      if (authorized) {
        console.log(date, " ", lastDate)
        const temperature = await GoogleFit.getBodyTemperatureSamples(opt);
        setMyData(temperature)
        console.log(temperature)
        setLoading(false)

        if (temperature.length > 0) {
          const tt = temperature.map((item) => item.value)
          setTemperatures(tt)
          setOrigTemperatures(tt)
        }


      }
      else{
        setLoading(false)
      }
    })

  }, [date])




  //function to be called on closing modal 
  const ok = () => {
    //making ModalVisible false to hide the modal
    setModalVisible(false);

  }

  const addToBlockchain = async () => {
    
    console.log("Length: ", origTemperatures.length)
    if (myData.length === 0) {
      setModalMsg("No Data Present");
      setModalVisible(true);
    }
    else {
      setLoading(true)
      const patientid = await AsyncStorage.getItem('addressid');
      fetch(`${HTTP_CLIENT_URL}/patient/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressid: patientid }),
      }).then(async res => {
        //On Sucessufully returning from API collect response
        const d1 = await res.json();
        console.log(d1);
        const mypatient = d1.patient

        //checking if the response has status ok
        if (d1.success) {

          // let avgTemperature = 0

          // for (let i = 0; i < origTemperatures.length; i++) {
          //   avgTemperature += origTemperatures[i]
          // }


          // avgTemperature=avgTemperature/origTemperatures.length;
       
          const dataToEncrypt = { file: 'Temperature', patient: patientid, myData, date: date.toLocaleDateString() }

          fetch(`${HTTP_CLIENT_URL}/rsa/encrypt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: mypatient.publickey, dataToEncrypt }),
          }).then(async res => {
            //On Sucessufully returning from API collect response
            const d1 = await res.json();
            console.log(d1);

            //checking if the response has status ok
            if (d1.success) {
              fetch(`${HTTP_CLIENT_URL}/ipfs/uploadFile`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file: "Temperature.json", content: d1.encryptedFile }),
              }).then(async res => {
                //On Sucessufully returning from API collect response
                const d2 = await res.json();
                console.log(d2);

                //checking if the response has status ok
                if (d2.success) {
                  fetch(`${HTTP_CLIENT_URL}/contracts/uploadVitals`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ patientid: patientid, fileType: "Temperature_"+date.toLocaleDateString(), hash: d2.hashValue }),
                  }).then(async res => {
                    //On Sucessufully returning from API collect response
                    const d = await res.json();
                    console.log(d);

                    //checking if the response has status ok
                    if (d.success) {
                      setLoading(false)
                      setModalMsg("Added Succesfully");
                      setModalVisible(true);
                    }
                    else {
                      setLoading(false)
                      console.log(d)
                      setModalMsg("Error uploading to Blockchain");
                      setModalVisible(true);
                    }
                  });
                }
                else {
                  setLoading(false)
                  console.log(d2)
                  setModalMsg("Error uploading to IPFS");
                  setModalVisible(true);
                }
              });
            }
            else {
              setLoading(false)
              console.log(d1)
              setModalMsg("Error Encrypting File");
              setModalVisible(true);
            }
          });
        }
        else {
          setLoading(false)
          console.log(d1)
          setModalMsg(d1.error);
          setModalVisible(true);
        }
      });
    }

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
        <BackAppBar message={"Temperature"} />
        <ImageBackground
          source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>

          <View style={{ marginTop: 80 }}>
            {
              fitAuthorized == "Authorized" &&
              <View>
                 <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  {loading && <ActivityIndicator color={"#fff"} />}
                </View>

                <TouchableOpacity
                  onPress={() => setOpen(true)}>
                  <TextInput
                    value={date.toDateString()}
                    style={styles.textfield}
                    editable={false}
                  />

                </TouchableOpacity>
                <DatePicker
                  modal
                  mode='date'
                  open={open}
                  date={date}
                  onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                  }}
                  onCancel={() => {
                    setOpen(false)
                  }}
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

                  <TouchableOpacity
                  onPress={addToBlockchain}>
                    <Text
                      style={styles.linktext}
                    >
                      Add to BlockChain
                    </Text>
                  </TouchableOpacity>
                </View>


              </View>


            }

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
  card: {
    width: '90%',
    height: 90,
    margin: '5%',
    borderRadius: 20,
    textAlign: 'center'

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

export default Temperature;
