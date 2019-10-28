import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello Wolrd</Text>
    </View>
  );
}
