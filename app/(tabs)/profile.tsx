import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IprofileProps {}

export default function profile({}: IprofileProps) {
  return (
    <View style={styles.container}>
      <Text>profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});