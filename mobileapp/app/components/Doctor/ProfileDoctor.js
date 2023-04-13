import * as React from 'react';
import { Modal, Portal, Text, Button, Provider, Card, Title, RadioButton, TextInput, Paragraph } from 'react-native-paper';
import { ScrollView, View, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Grid, Row, Col } from 'react-native-paper-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTTP_CLIENT_URL } from '../../url';
import { transformFileAsync } from '@babel/core';


const ProfileDoctor = () => {

  //declaring state variables
  const navigation = useNavigation();
  const [visibleGender, setvisibleGender] = React.useState(false);
  const [gender, setGender] = React.useState('');
  const [modalGender, setModalGender] = React.useState('');
  const [visibleSpecialization, setvisibleSpecialization] = React.useState(false);
  const [specialization, setSpecialization] = React.useState('None');
  const [modalSpecialization, setModalSpecialization] = React.useState('');

  const [doctorName, setDoctorName] = React.useState("");
  const [addressId, setAddressId] = React.useState("");

  React.useEffect(() => {
    start()
  },
    [gender])


  // get doctor account information from database
  const start = async () => {
    try {
      const addressid = await AsyncStorage.getItem("addressid");

      const response = fetch(`${HTTP_CLIENT_URL}/doctorProfile/get`, {
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
          setDoctorName(d.doctorProfile.doctor.name);
          setAddressId(d.doctorProfile.doctor.email)
          setEducation(d.doctorProfile.education)
          setSpecialization(d.doctorProfile.specialization);
          setExperience(d.doctorProfile.experience)
          setGender(d.doctorProfile.gender)

        }

      });
    }
    catch (error) {
      console.log(error);
    }
  }

  //on logout remove the address id from shared storage
  const logout = async () => {
    await AsyncStorage.setItem(
      'addressid',
      "",
    );
    await AsyncStorage.setItem(
      'isdoctorloggedIn',
      "0",
    );
    navigation.navigate('StartPage');
  }

  const showModalGender = () => {
    setModalGender(gender);
    setvisibleGender(true);
  }
  const hideModalGender = () => {
    setvisibleGender(false);
  }
  const okGender = async () => {
    setGender(modalGender);
    setvisibleGender(false);

    try {
      const addressid = await AsyncStorage.getItem("addressid");
      const response = fetch(`${HTTP_CLIENT_URL}/doctorProfile/updateGender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressid, gender: modalGender }),
      }).then(async res => {
        //On Sucessufully returning from API collect response
        console.log(res);
        const d = await res.json();
        //checking if the response has status ok
        if (d.success) {
          console.log(d);
        }

      });
    }
    catch (error) {
      console.log(error);
    }

  }

  const cancelGender = () => {

    setvisibleGender(false);

  }

  const [visibleEducation, setvisibleEducation] = React.useState(false);
  const [education, setEducation] = React.useState('MBBS');
  const [modalEducation, setModalEducation] = React.useState('');

  const showModalEducation = () => {
    setModalEducation(education);
    setvisibleEducation(true);
  }
  const hideModalEducation = () => {
    setvisibleEducation(false);
  }
  const okEducation = async () => {
    setEducation(modalEducation);
    setvisibleEducation(false);

    try {

      const addressid = await AsyncStorage.getItem("addressid");
      const response = fetch(`${HTTP_CLIENT_URL}/doctorProfile/updateEducation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressid, education: modalEducation }),
      }).then(async res => {
        //On Sucessufully returning from API collect response
        console.log(res);
        const d = await res.json();
        //checking if the response has status ok
        if (d.success) {
          console.log(d);
        }

      });
    }
    catch (error) {
      console.log(error);
    }

  }

  const cancelEducation = () => {
    setvisibleEducation(false);

  }

  const showModalSpecialization = () => {
    setModalSpecialization(specialization);
    setvisibleSpecialization(true);
  }
  const hideModalSpecialization = () => {
    setvisibleSpecialization(false);
  }
  const okSpecialization = async () => {
    setSpecialization(modalSpecialization);
    setvisibleSpecialization(false);

    try {

      const addressid = await AsyncStorage.getItem("addressid");
      const response = fetch(`${HTTP_CLIENT_URL}/doctorProfile/updateSpecialization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressid, specialization: modalSpecialization }),
      }).then(async res => {
        //On Sucessufully returning from API collect response
        console.log(res);
        const d = await res.json();
        //checking if the response has status ok
        if (d.success) {
          console.log(d);
        }

      });
    }
    catch (error) {
      console.log(error);
    }

  }

  const cancelSpecialization = () => {
    setvisibleSpecialization(false);

  }

  const [visibleExperience, setvisibleExperience] = React.useState(false);
  const [experience, setExperience] = React.useState(0);
  const [modalExperience, setModalExperience] = React.useState();

  const showModalExperience = () => {
    setModalExperience(experience);
    setvisibleExperience(true);
  }
  const hideModalExperience = () => {
    setvisibleExperience(false);
  }
  const okExperience = async () => {
    if (modalExperience >= 0) {
      setExperience(modalExperience);
      setvisibleExperience(false);

      try {
        const addressid = await AsyncStorage.getItem("addressid");
        const response = fetch(`${HTTP_CLIENT_URL}/doctorProfile/updateExperience`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ addressid, experience: modalExperience }),
        }).then(async res => {
          //On Sucessufully returning from API collect response
          console.log(res);
          const d = await res.json();
          //checking if the response has status ok
          if (d.success) {
            console.log(d);
          }

        });
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      setModalExperience(0)
    }

  }

  const cancelExperience = () => {
    setvisibleExperience(false);

  }

  return (
    <Provider>
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
          visible={visibleSpecialization}
          onDismiss={hideModalSpecialization}
          contentContainerStyle={styles.modalAge}>
          <View>

            <TextInput
              mode='outlined'
              label='Specialization'
              value={modalSpecialization}
              onChangeText={text => setModalSpecialization(text)}>

            </TextInput>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okSpecialization}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelSpecialization}>
              Cancel
            </Button>
          </View>


        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={visibleExperience}
          onDismiss={hideModalExperience}
          contentContainerStyle={styles.modalAge}>
          <View>

            <TextInput
              mode='outlined'
              keyboardType='numeric'
              label='Experience(years)'
              value={modalExperience}
              onChangeText={text => setModalExperience(text)}>
            </TextInput>

            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okExperience}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelExperience}>
              Cancel
            </Button>
          </View>

        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={visibleEducation}
          onDismiss={hideModalEducation}
          contentContainerStyle={styles.modalAge}>
          <ScrollView>

            <TextInput
              mode='outlined'
              label='Education'
              value={modalEducation}
              onChangeText={text => setModalEducation(text)}>

            </TextInput>


            <Button
              mode='contained'
              buttonColor='#00ced1'
              style={styles.okbutton}
              onPress={okEducation}>
              Ok
            </Button>
            <Button
              mode='outlined'
              style={styles.cancelbutton}
              onPress={cancelEducation}>
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
              variant="headlineMedium">{doctorName}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 15,
                color: 'white'
              }}
              variant="titleMedium">
              {addressId}
            </Text>

            <TouchableOpacity
              style={styles.grid1}
              activeOpacity={1}
              onPress={showModalGender}>
              <Grid style={styles.mainGrid1}>
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
              onPress={showModalEducation}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14
                    }}>
                    Education
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{ fontSize: 14 }}>
                    {education}
                  </Text>
                </Row>
              </Grid>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grid}
              activeOpacity={1}
              onPress={showModalSpecialization}>
              <Grid style={styles.mainGrid}>
                <Row>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14
                    }}>
                    Specialization
                  </Text>
                </Row>
                <Row>
                  <Text
                    style={{ fontSize: 14 }}>
                    {specialization}
                  </Text>
                </Row>
              </Grid>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.grid1}
              activeOpacity={1}
              onPress={showModalExperience}>
              <Grid style={styles.mainGrid1}>
                <Row>
                  <Col>
                    <Text style={styles.ColGridLeft}>
                      Experience
                    </Text>
                  </Col>
                  <Col>
                    <Text style={styles.ColGridRight}>
                      {experience} yrs
                    </Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>

            <Button
              style={styles.okbutton}
              buttonColor='white'
              textColor='black'
              onPress={logout}>
              Logout
            </Button>

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
    height: 75,
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    textAlign: 'center'

  },
  grid1: {
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
    borderRadius: 20,

  },
  mainGrid1: {
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


export default ProfileDoctor;


