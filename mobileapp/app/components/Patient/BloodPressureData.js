import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { Card, Title, Surface, Text} from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'


const BloodPressureData = ({ route }) => {

  const [elements, setElements] = React.useState([]);
  const navigation = useNavigation();
  const [date, setDate] = React.useState("")
 

  React.useEffect(() => {
    setElements(route.params.element);
    setDate(route.params.date)
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();

  

  }, [])

  

  

  

  return (
    <View style={styles.container}>
      <BackAppBar message={date} />
      <ImageBackground
        source={require('../../images/appBack.jpg')}
        resizeMode="cover"
        style={{ height: '100%' }}>

        <ScrollView>

          <View style={styles.rows}>
            {
              elements.map(element => (

                <Surface
                  key={element.endDate}
                  style={styles.card}
                  elevation={3}>
                  <Card
                    style={styles.maincard}
                    mode='contained'
                    >

                    <Card.Content
                      style={{
                        flex: 1,
                      }}>

                      <View>
                      <Text
                      variant='bodyLarge'
                        style={{
                          color: 'black',
                          marginStart: 10
                        }}>
                        {new Date(element.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>

                      </View>

                     
                    

                      <Text
                      variant='bodyLarge'
                        style={{
                          color: 'black',
                        fontWeight: 'bold',
                        marginStart: 10
                        }}>
                        {element.systolic}/{element.diastolic} mmHg
                      </Text>
                      
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
    marginTop: 80
  },
  card: {
    width: '90%',
    height: 70,
    margin: '5%',
    borderRadius: 20,
    textAlign: 'center'

  },
  maincard: {
    borderRadius: 20,
    height: 90,
    backgroundColor: 'whitesmoke',

  },

});

export default BloodPressureData;
