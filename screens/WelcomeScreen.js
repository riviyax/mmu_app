import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";

export default function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("automatic");

  // ✅ Load saved username on screen load
  useEffect(() => {
    const loadUsername = async () => {
      const savedName = await AsyncStorage.getItem("username");
      if (savedName) setUsername(savedName);
    };
    loadUsername();
  }, []);

  const handleNext = async () => {
    // ✅ Save username to storage
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("hasLaunched", "true");
    navigation.replace("Verify");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>MMU MARKS</Text>
      <Text style={styles.subtitle}>MANAGE MEMBERS MARKS AND DATA</Text>

      {/* Username */}
      <Text style={styles.label}>USERNAME</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Theme */}
      <Text style={styles.label}>THEME</Text>
      <View style={styles.themePicker}>
        <Feather name="settings" size={18} color="#555" style={{ marginRight: 8 }} />
        <Picker
          selectedValue={theme}
          onValueChange={setTheme}
          style={{ flex: 1 }}
        >
          <Picker.Item label="Automatic" value="automatic" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>NEXT</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>DEVELOPED BY RIVIYA_X</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 170,
    height: 120,
    resizeMode: "contain",
    marginBottom: 0,
    marginTop: -40,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Poppins_400Regular",
    marginBottom: 25,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1.2,
    borderColor: "#bbb",
    borderRadius: 6,
    padding: 10,
    fontFamily: "Poppins_400Regular",
  },
  themePicker: {
    width: "100%",
    borderWidth: 1.2,
    borderColor: "#bbb",
    borderRadius: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#111",
    width: "100%",
    paddingVertical: 13,
    borderRadius: 7,
    marginTop: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    fontSize: 10,
    fontFamily: "Poppins_700Bold",
    color: "#777",
  },
});
