import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, Provider, Portal, Modal, TextInput } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import DatePicker from 'react-native-date-picker';
import { LineChart } from 'react-native-chart-kit';

const BloodPressure = () => {

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
  const [diastolic, setDiastolic] = React.useState(70);
  const [systolic, setSystolic] = React.useState(120);

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
    GoogleFit.checkIsAuthorized().then(async () => {
      var lastDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      const opt = {
        startDate: lastDate.toISOString(), // required ISO8601Timestamp
        endDate: date.toISOString(), // required ISO8601Timestamp
        bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
      };
      var authorized = GoogleFit.isAuthorized;
      if (authorized) {
        console.log(date, " ", lastDate)
        const bloodpressure = await GoogleFit.getBloodPressureSamples(opt);
        setMyData(bloodpressure)
        console.log(bloodpressure)
        

        if(bloodpressure.length>0){
          const systolics = bloodpressure.map(item => item.systolic)
        const diastolics = bloodpressure.map(item => item.diastolic)
        const s=Math.max(...systolics)
        const d=Math.min(...diastolics)
          setSystolic(s+5)
          setDiastolic(d-5)
  
          console.log(systolics)
          console.log(diastolics)
  
          console.log(s+5)
          console.log(d-5)
  

        }

      
        

      }
    })

  }, [date])




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
        <BackAppBar message={"Blood Pressure"} />
        <ImageBackground
          source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>

          <View style={{ marginTop: 80 }}>
            {
              fitAuthorized == "Authorized" &&
              <View>
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
                    labels: myData.map((item) =>
                      new Date(item.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ),
                    datasets: [
                      {
                        data: myData.map((item)=> item.systolic)
                      },
                      {
                        data: myData.map((item)=> item.diastolic)
                      },
                      {
                        data: [diastolic],
                        withDots: false
                      },
                      {
                        data: [systolic],
                        withDots: false
                      }
                    ]
                  }}
                  width={Dimensions.get("window").width -20} // from react-native
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
                  <TouchableOpacity>
                    <Text
                      style={styles.linktext}
                      onPress={()=> navigation.navigate('BloodPressureData', {date: date.toLocaleDateString(),element: myData})}
                    >
                      See All Data
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity>
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
  modalAge: {
    backgroundColor: 'white',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 20,
    borderRadius: 10

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

export default BloodPressure;
