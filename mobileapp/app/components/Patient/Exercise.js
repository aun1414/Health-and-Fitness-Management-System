import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { Card, Title, Surface } from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';



const Exercise = () => {

  const navigation = useNavigation();
  const [elements, setElements] = React.useState([]);

  React.useEffect(() => {
    getElements();
    const backAction = () => {
      navigation.goBack();
      return true;


    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [])




  React.useEffect(() => { getElements(); }, [])

  function getElements() {
    var elementsArr = [
      { key: 1, name: 'Walking', uri: require('../../images/walking.png') },
      { key: 2, name: 'Running', uri: require('../../images/running.png') },
      { key: 3, name: 'Cycling', uri: require('../../images/cycling.png') },
      { key: 4, name: 'IoT Devices', uri: require('../../images/iot.png') },
    ]
    setElements(elementsArr);


  }



  return (
    <View style={styles.container}>
      <BackAppBar message={"Exercise"} />
      <ImageBackground
        source={require('../../images/appBack.jpg')}
        resizeMode="cover"
        style={{ height: '100%' }}>
        <ScrollView >

          <View style={styles.rows}>
            {
              elements.map(element => (

                <Surface
                  key={element.key}
                  style={styles.card}
                  elevation={5}>
                  <Card
                    style={styles.maincard}
                    mode='contained'>

                    <Card.Content
                      style={{
                        flex: 1,
                        flexDirection: 'row'
                      }}>

                      <View style={{ width: 60, height: 60 }}>
                        <Card.Cover
                          source={element.uri}
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: "contain",
                            alignSelf: "center",
                            backgroundColor: 'transparent'
                          }} />
                      </View>

                      <Title
                        style={{
                          color: 'cornflowerblue',
                          marginVertical: 15,
                          marginStart: 15
                        }} >
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
    marginTop: 80

  },
  card: {
    width: '90%',
    height: 90,
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

export default Exercise;
