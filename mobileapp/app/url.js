import {Platform} from 'react-native';

const HTTP_CLIENT_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

export {HTTP_CLIENT_URL};