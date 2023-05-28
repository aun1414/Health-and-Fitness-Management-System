import {Platform} from 'react-native';

const HTTP_CLIENT_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://192.168.10.4:8000',
});

export {HTTP_CLIENT_URL};