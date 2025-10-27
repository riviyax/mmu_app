import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen({ navigation }) {
  // useEffect(() => {
  //   const checkFirstLaunch = async () => {
  //     const hasLaunched = await AsyncStorage.getItem("hasLaunched");
  //     if (hasLaunched === "true") {
  //       navigation.replace("Verify"); // Skip welcome
  //     }
  //   };
  //   checkFirstLaunch();
  // }, []);


  const handleGetStarted = async () => {
    navigation.replace("Verify");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Manage MMU Members Data and Marks in one Place
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  image: { width: 300, height: 300, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 50, fontFamily: "Poppins_700Bold", marginBottom: -25 },
  subtitle: { fontSize: 20, textAlign: "center", fontFamily: "Poppins_400Regular", color: "#777", marginVertical: 10 },
  button: { backgroundColor: "#222", paddingVertical: 18, paddingHorizontal: 35, borderRadius: 10, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 15, fontFamily: "Poppins_700Bold" },
});
