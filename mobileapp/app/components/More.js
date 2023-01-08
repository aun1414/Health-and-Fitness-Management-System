import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Card, Title, Surface, Paragraph } from 'react-native-paper';

const More = () => {

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/appBack.jpg')}
        resizeMode="cover"
        style={{ height: '100%' }}>

        <ScrollView >
          <View style={styles.rows}>
            <Surface
              style={styles.card}
              elevation={5}>
              <Card
                style={styles.maincard}
                mode='contained'>
                <Card.Content>
                  <Title
                    style={{ color: 'cornflowerblue' }}>
                    About Us
                  </Title>
                  <Paragraph>
                    MedChain is a mobile app designed to allow patients to keep and access their own medical records. Patients can get full control on their medical records and can share it with doctors as well.
                  </Paragraph>
                  <Paragraph>
                    Patient can also get rewards by Recording physical Activity
                  </Paragraph>
                </Card.Content>
              </Card>

            </Surface>

            <Surface style={styles.card} elevation={5}>
              <Card style={styles.maincard} mode='contained'>
                <Card.Content>
                  <Title
                    style={{ color: 'cornflowerblue' }}>
                    Contact Us
                  </Title>
                  <Paragraph>
                    medchainhelp@medchain.com
                  </Paragraph>
                </Card.Content>
              </Card>

            </Surface>
            
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
    marginTop: 20,
    display: 'flex',

  },
  card: {
    width: '90%',
    margin: '5%',
    borderRadius: 30,
    textAlign: 'center'

  },
  maincard: {
    borderRadius: 30,
    backgroundColor: 'whitesmoke',

  },


});

export default More;
