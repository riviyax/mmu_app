import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyScreen({ navigation }) {
  const [code, setCode] = useState(["", "", ""]);
  const [loading, setLoading] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const hasLog = await AsyncStorage.getItem("hasLogged");
        if (hasLog === "true") {
          // Already logged in → skip code screen
          navigation.replace("Wait");
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Error checking login:", e);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleInput = async (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to next input
    if (value && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check full code
    if (newCode.every((digit) => digit !== "")) {
      const enteredCode = newCode.join("");
      if (enteredCode === "548") {
        await AsyncStorage.setItem("hasLogged", "true");
        navigation.replace("Wait");
      } else {
        Alert.alert("Incorrect Code", "Please try again.");
        setCode(["", "", ""]);
        inputRefs.current[0].focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VERIFY</Text>
      <Text style={styles.subtitle}>Enter Developer Code to Continue</Text>
      <View style={styles.inputRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.inputBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(val) => handleInput(val, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontFamily: "Poppins_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#555", marginBottom: 20 },
  inputRow: { flexDirection: "row", gap: 10, marginBottom: 30 },
  inputBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
