import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './screens/WelcomeScreen';
import VerifyScreen from './screens/VerifyScreen';
import WaitScreen from './screens/WaitScreen';
import DatabaseScreen from './screens/DatabaseScreen';
import UpdateAvailableScreen from './screens/UpdateAvailableScreen';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  // ✅ Check for OTA updates
  const checkForUpdates = useCallback(async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.log('Error checking updates:', error);
    }
  }, []);

  // ✅ Handle applying update
  const handleUpdateNow = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.log('Error updating app:', error);
    }
  };

  // ✅ Load flags & determine initial route
  useEffect(() => {
    async function prepare() {
      try {
        await checkForUpdates();

        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const hasLogged = await AsyncStorage.getItem('hasLogged');

        if (!hasLaunched) {
          // First time launching the app
          await AsyncStorage.setItem('hasLaunched', 'true');
          setInitialRoute('Welcome');
        } else if (hasLogged === 'true') {
          // User already logged in
          setInitialRoute('Wait');
        } else {
          // Skip WelcomeScreen on subsequent launches
          setInitialRoute('Verify');
        }
      } catch (error) {
        console.log('Error during initialization:', error);
      } finally {
        if (fontsLoaded) await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded || !initialRoute) return null;

  // ✅ Show update screen if OTA update available
  if (updateAvailable) {
    return <UpdateAvailableScreen onUpdate={handleUpdateNow} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="Wait" component={WaitScreen} />
        <Stack.Screen name="Database" component={DatabaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
