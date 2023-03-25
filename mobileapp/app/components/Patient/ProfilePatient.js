import * as React from 'react';
import { Modal, Portal, Text, Button, Provider, RadioButton, TextInput } from 'react-native-paper';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Grid, Row, Col } from 'react-native-paper-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';
import GoogleFit, { Scopes } from 'react-native-google-fit'


const ProfilePatient = () => {

  //declare state variables

  const navigation = useNavigation();

  const [visibleGender, setvisibleGender] = React.useState(false);
  const [gender, setGender] = React.useState('male');
  const [modalGender, setModalGender] = React.useState('');
  const [visibleBloodGroup, setvisibleBloodGroup] = React.useState(false);
  const [bloodGroup, setBloodGroup] = React.useState('A+');
  const [modalbloodGroup, setModalBloodGroup] = React.useState('');
  const [visibleWeight, setvisibleWeight] = React.useState(false);
  const [weight, setWeight] = React.useState(0);
  const [modalweight, setModalWeight] = React.useState(0);
  const [visibleHeight, setvisibleHeight] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const [modalHeight, setModalHeight] = React.useState(0);
  const [visibleAge, setvisibleAge] = React.useState(false);
  const [age, setAge] = React.useState(0);
  const [modalAge, setModalAge] = React.useState(0);
  const [targetSteps, setTargetSteps] = React.useState(0);

  const [patientName, setPatientName] = React.useState("");
  const [addressId, setAddressId] = React.useState("");

  React.useEffect(()=>{
    start()
  },
  [gender])

  //get account information of patient from database
  const start = async() =>{
    try{
      const addressid = await AsyncStorage.getItem("addressid");
      
      const response = fetch(`${HTTP_CLIENT_URL}/patientProfile/get`, {
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
          setPatientName(d.patientProfile.patient.name);
          setAddressId(d.patientProfile.patient.email);
          setAge(d.patientProfile.age);
          setGender(d.patientProfile.gender);
          setHeight(d.patientProfile.height);
          setWeight(d.patientProfile.weight);
          setBloodGroup(d.patientProfile.bloodGroup)
          setTargetSteps(d.patientProfile.target)
        }
        
      });
    }
    catch (error) {
      console.log(error);
    }
  }


  const logout = async () => {
    await AsyncStorage.setItem(
      'addressid',
      "",
    );
    await AsyncStorage.setItem(
        'ispatientloggedIn',
        "0",
      );
      // GoogleFit.disconnect();
    navigation.navigate('StartPage');
  }

  const showModalGender = () => {
    setModalGender(gender);
    setvisibleGender(true);
  }

  const hideModalGender = () => {
    setvisibleGender(false);
  }

  const okGender = () => {
    setGender(modalGender);
    setvisibleGender(false);

  }

  const cancelGender = () => {
    setvisibleGender(false);
  }

  const showModalBloodGroup = () => {
    setModalBloodGroup(bloodGroup);
    setvisibleBloodGroup(true);
  }

  const hideModalBloodGroup = () => {
    setvisibleBloodGroup(false);
  }

  const okBloodGroup = () => {
    setBloodGroup(modalbloodGroup);
    setvisibleBloodGroup(false);

  }

  const cancelBloodGroup = () => {
    setvisibleBloodGroup(false);
  }


  const showModalWeight = () => {
    setModalWeight(weight);
    setvisibleWeight(true);
  }
  const hideModalWeight = () => {
    setvisibleWeight(false);
  }
  const okWeight = () => {
    setWeight(modalweight);
    setvisibleWeight(false);

  }

  const cancelWeight = () => {
    setvisibleWeight(false);

  }


  const showModalHeight = () => {
    setModalHeight(height);
    setvisibleHeight(true);
  }
  const hideModalHeight = () => {
    setvisibleHeight(false);
  }
  const okHeight = () => {
    setHeight(modalHeight);
    setvisibleHeight(false);

  }

  const cancelHeight = () => {
    setvisibleHeight(false);

  }

  const showModalAge = () => {
    setModalAge(age);
    setvisibleAge(true);
  }
  const hideModalAge = () => {
    setvisibleAge(false);
  }
  const okAge = () => {
    setAge(modalAge);
    setvisibleAge(false);

  }

  const cancelAge = () => {
    setvisibleAge(false);
  }


  return (
    <Provider>

      <Portal>
        <Modal
          visible={visibleAge}
          onDismiss={hideModalAge}
          contentContainerStyle={styles.modalAge}>
          <View>

            <TextInput
              mode='outlined'
              keyboardType='numeric'
              label='Age(yrs)'
              value={modalAge}
              onChangeText={text => setModalAge(text)}>

            </TextInput>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okAge}>
              Ok
            </Button>

            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelAge}>
              Cancel
            </Button>
          </View>


        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={visibleGender}
          onDismiss={hideModalGender}
          contentContainerStyle={styles.modalAge}>
          <View>

            <RadioButton.Group
              onValueChange={value => setModalGender(value)}
              value={modalGender}>
              <RadioButton.Item label="Male" value="male" />
              <RadioButton.Item label="Female" value="female" />
            </RadioButton.Group>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okGender}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelGender}>
              Cancel
            </Button>
          </View>


        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={visibleWeight}
          onDismiss={hideModalWeight}
          contentContainerStyle={styles.modalAge}>
          <View>

            <TextInput
              mode='outlined'
              keyboardType='numeric'
              label='Weight(kg)'
              value={modalweight}
              onChangeText={text => setModalWeight(text)}>

            </TextInput>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okWeight}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelWeight}>
              Cancel
            </Button>
          </View>


        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={visibleHeight}
          onDismiss={hideModalHeight}
          contentContainerStyle={styles.modalAge}>
          <View>

            <TextInput
              mode='outlined'
              keyboardType='numeric'
              label='Height(cm)'
              value={modalHeight}
              onChangeText={text => setModalHeight(text)}>

            </TextInput>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okHeight}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelHeight}>
              Cancel
            </Button>
          </View>


        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={visibleBloodGroup}
          onDismiss={hideModalBloodGroup}
          contentContainerStyle={styles.modalAge}>
          <ScrollView>

            <RadioButton.Group
              onValueChange={value => setModalBloodGroup(value)}
              value={modalbloodGroup}>
              <RadioButton.Item label="A+" value="A+" />
              <RadioButton.Item label="B+" value="B+" />
              <RadioButton.Item label="AB+" value="AB+" />
              <RadioButton.Item label="O+" value="O+" />
              <RadioButton.Item label="A-" value="A-" />
              <RadioButton.Item label="B+" value="B-" />
              <RadioButton.Item label="AB-" value="AB-" />
              <RadioButton.Item label="O-" value="O-" />

            </RadioButton.Group>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okBloodGroup}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelBloodGroup}>
              Cancel
            </Button>
          </ScrollView>


        </Modal>
      </Portal>

      <View style={styles.container}>
        <ImageBackground
          source={require('../../images/appBack.jpg')}
          resizeMode="cover"
          style={{ height: '100%' }}>

          <ScrollView>
            <Image
              source={require('../../images/profile.png')}
              style={styles.image}
            />

            <Text
              style={{
                textAlign: 'center',
                color: 'cornflowerblue'
              }}
              variant="headlineMedium">
              {patientName}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 15,
                color: 'white'
              }}
              variant="ColMedium">
              {addressId}
            </Text>


            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={showModalAge}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Age
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.ColGridRight}>
                      {age} yrs
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={showModalGender}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Gender
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.ColGridRight}>
                      {gender}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={showModalWeight}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Weight
                    </Text>
                  </Col>
                  <Col><Text style={styles.ColGridRight} >{weight} kg</Text></Col>
                </Row>
              </Grid>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={showModalHeight}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Height
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.ColGridRight}>
                      {height} cm
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={showModalBloodGroup}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Blood Group
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.ColGridRight} >
                      {bloodGroup}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Target Steps
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.ColGridRight} >
                      {targetSteps}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={() => navigation.navigate('Ranks')}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Ranks
                    </Text>
                  </Col>
                  
                </Row>
              </Grid>
            </TouchableOpacity>





            <Button style={styles.okbutton} buttonColor='white' textColor='black' onPress={logout}>Logout</Button>

          </ScrollView>
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
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 10,
    height: 50,
    width: 50
  },
  ColGridRight: {
    color: 'black',
    width: '50%',
    textAlign: 'right',
    alignSelf: 'flex-end',
    fontSize: 14
  },
  ColGridLeft: {
    color: 'black',
    width: '50%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold'

  },
  rows: {

    margin: 10,
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  grid: {
    height: 48,

    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    textAlign: 'center'

  },
  mainGrid: {
    marginLeft: 10,
    marginRight: 10,

    backgroundColor: 'white',
    borderRadius: 30,

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
    margin: 20,

  },
  cancelbutton: {
    margin: 10,

  }


});


export default ProfilePatient;





