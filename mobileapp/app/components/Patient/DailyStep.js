import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, Provider, Portal, Modal, TextInput } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import DatePicker from 'react-native-date-picker';
import { ProgressChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';

const DailyStep = () => {

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
    const [myData, setMyData] = React.useState({ "value": 0 });
    const [target, setTarget] = React.useState(8000);


    React.useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;


        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [])

    React.useEffect( async ()=>{
   
            const addressid = await AsyncStorage.getItem("addressid");
            
            fetch(`${HTTP_CLIENT_URL}/patientProfile/getTargetSteps`, {
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
                setTarget(d.steps)
                console.log(target)
                
              }
              
            });
        
          
       
    }, [])

    
    React.useEffect(() => {
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
                const res = await GoogleFit.getDailyStepCountSamples(opt);
                if (res.length !== 0) {
                    for (var i = 0; i < res.length; i++) {

                        if (res[i].source === 'com.google.android.gms:estimated_steps') {

                            console.log(res[i])
                            dailyStepCount = res[i].steps;
                            console.log("Steps:", dailyStepCount)
                            if (dailyStepCount.length !== 0) {
                               
                                
                            }
                            else {
                                
                            }


                        }
                    }
                };


            }
        })

    }, [date])

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
                const res = await GoogleFit.getDailyStepCountSamples(opt);
                if (res.length !== 0) {
                    for (var i = 0; i < res.length; i++) {

                        if (res[i].source === 'com.google.android.gms:estimated_steps') {

                            console.log(res[i])
                            dailyStepCount = res[i].steps;
                            console.log("Steps:", dailyStepCount)
                            if (dailyStepCount.length !== 0) {
                                setMyData(dailyStepCount[0])
                                console.log(dailyStepCount[0], target)
                                if(dailyStepCount[0].value>target){
                                    setTarget(dailyStepCount[0].value)
                                    console.log(dailyStepCount[0], target)
                                }
                            }
                            else {
                                setMyData({ "value": 0 });
                            }


                        }
                    }
                };


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
                <BackAppBar message={"Daily Steps"} />
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

                                <ProgressChart
                                    data={{
                                        labels: ["Steps"],
                                        data: [myData.value / target]
                                    }}
                                    width={Dimensions.get("window").width - 20}
                                    height={250}
                                    strokeWidth={20}
                                    radius={80}
                                    chartConfig={{
                                        backgroundGradientFrom: "#FFFFFF",
                                        backgroundGradientTo: "#FFFFFF",
                                        backgroundGradientToOpacity: 1,
                                        color: (opacity = 1) => `rgba(0, 80, 255, ${opacity})`,
                                        strokeWidth: 2, // optional, default 3
                                        barPercentage: 0.5,
                                        useShadowColorFromDataset: false // optional
                                    }}
                                    hideLegend={false}
                                    style={{
                                        marginVertical: 10,
                                        marginHorizontal: 12,
                                    }}

                                />

                                <View style={styles.rowline}>
                       
                                        <Text
                                            style={styles.linktext}
                                          >
                                            {myData.value} Steps
                                        </Text>


                                    
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
    linktext: {
        color: 'white',
        fontSize: 16,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10
    },
    rowline: {
        flexDirection: 'row',
        justifyContent: 'center',
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

export default DailyStep;
