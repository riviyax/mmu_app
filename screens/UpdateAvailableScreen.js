import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function UpdateAvailableScreen({ onUpdate }) {
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800}>
        <Image 
          source={{ uri: "https://i.imgur.com/8fK4Fj5.png" }} 
          style={styles.image} 
        />
      </Animatable.View>

      <Animatable.Text animation="fadeInUp" duration={800} style={styles.title}>
        Update Available 🚀
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={200} duration={800} style={styles.subtitle}>
        A new version of the app is ready with improvements and fixes.
      </Animatable.Text>

      <Animatable.View animation="zoomIn" delay={500}>
        <TouchableOpacity style={styles.button} onPress={onUpdate}>
          <Text style={styles.buttonText}>Update Now</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1E1E1E',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6A6A6A',
    marginBottom: 40,
    paddingHorizontal: 15
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 12,
    elevation: 4
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
});
