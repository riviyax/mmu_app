import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UpdateAvailableScreen({ onUpdate }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>A new update is available!</Text>
      <TouchableOpacity style={styles.button} onPress={onUpdate}>
        <Text style={styles.buttonText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: '600' },
});
