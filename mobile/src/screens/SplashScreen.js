import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('RoleSelection');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>بنیان مرصوص</Text>
        <Text style={styles.subtitle}>AI-Powered Quran Teacher Finder</Text>
        <Text style={styles.footer}>Rawalpindi | Islamabad</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#01411C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'System', // Arabic/Urdu style
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  footer: {
    color: '#E8F5E9',
    fontSize: 14,
    opacity: 0.8,
  },
});
