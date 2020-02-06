import { AsyncStorage } from 'react-native';

export default {
  setItem: async function (key, value) {
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // console.error('AsyncStorage#setItem error: ' + error.message);
    }
  },
  getItem: async function (key) {
    return await AsyncStorage.getItem(key)
      .then((result) => {
        if (result) {
          try {
            result = JSON.parse(result);
          } catch (e) {
            // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
          }
        }
        return result;
      });
  },
  removeItem: async function (key) {
    return await AsyncStorage.removeItem(key);
  },
  multiSet: async function (keyValuePairs) { // can't seem to get working
    try {
      return await AsyncStorage.multiSet(keyValuePairs)
    } catch (e) {
      // console.error('AsyncStorage#multiSet error: ' + error.message);
    }
  },
  multiRemove: async function (keys) {
    return await AsyncStorage.multiRemove(keys)
  }
}
