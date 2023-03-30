import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { Card, Title, Surface, Text} from 'react-native-paper';
import BackAppBar from '../BackAppBar';
import { useNavigation } from '@react-navigation/native';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import { HTTP_CLIENT_URL } from '../../url';

const Ranks = () => {

  const navigation = useNavigation();
  const [date, setDate] = React.useState(new Date())
  const [records, setRecords] = React.useState([])
  var counter = 0;
 

  React.useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();

  

  }, [])

  React.useEffect(() => {
    counter = 0;

    fetch(`${HTTP_CLIENT_URL}/patientProfile/getPatientProfileDataOnSteps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      }).then(async res => {
        //On Sucessufully returning from API collect response
        const d2 = await res.json();
        console.log(d2);
        
          //checking if the response has status ok
        if (d2.success) {
          let c=1;
          let rec=d2.records;

          if(rec.length>0){
            rec[0].counter=c
            c++;
          }

          for(i=1; i<rec.length; i++){
            if(rec[i].steps===rec[i-1].steps){
              rec[i].counter=rec[i-1].counter
            }
            else{
              rec[i].counter=c
              c++;
            }
          }
  
          setRecords(rec);
          
  
        }
        else {
          console.log("Couldnot get data",d2)
          
      }
      });

  }, [date])
  

  

  

  return (
    <View style={styles.container}>
      <BackAppBar message={"Ranks"} />
      <ImageBackground
        source={require('../../images/appBack.jpg')}
        resizeMode="cover"
        style={{ height: '100%' }}>

        <ScrollView>

          <View style={styles.rows}>
            {
              records.map(record => (

                <Surface
                  key={counter}
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
                          fontWeight: 'bold',
                          marginStart: 10
                        }}>
                         {record.counter} . {record.patient.name} ({record.patient.email})
                      </Text>

                      </View>

                     
                    

                      <Text
                      variant='bodyLarge'
                        style={{
                          color: 'black',
                        
                        marginStart: 10
                        }}>
                        {record.steps} steps
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

export default Ranks;
