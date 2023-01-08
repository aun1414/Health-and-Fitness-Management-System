import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const BackAppBar = (props) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header
      mode='center-aligned'
      elevated="true"
      style={styles.container}>
      <Appbar.Action
        iconColor='white'
        icon={require('../images/back.png')}
        onPress={() => navigation.goBack()} />
      <Appbar.Content
        titleStyle={{ color: 'white' }}
        title={props.message} />

    </Appbar.Header>

  );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'cornflowerblue',
    textDecorationColor: 'white',
    shadowColor: 'white',
    position: 'absolute',

  },



});

export default BackAppBar;