import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function RoleSelectionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Bunyan-un-Marsoos</Text>
        <Text style={styles.subtitle}>Please select your role to continue</Text>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('StudentSignup')}
        >
          <Text style={styles.cardIcon}>👨‍🎓</Text>
          <Text style={styles.cardTitle}>Student / Parent</Text>
          <Text style={styles.cardDesc}>I want to find a Quran teacher</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('TeacherSignup')}
        >
          <Text style={styles.cardIcon}>👨‍🏫</Text>
          <Text style={styles.cardTitle}>Quran Teacher</Text>
          <Text style={styles.cardDesc}>I want to teach students</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cardOutline} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.cardOutlineText}>Already have an account? Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.adminBtn} 
          onPress={() => navigation.navigate('Login', { defaultRole: 'admin' })}
        >
          <Text style={styles.adminBtnText}>Admin Access</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#01411C' },
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: '#E8F5E9', fontSize: 16, marginBottom: 40, textAlign: 'center' },
  card: { backgroundColor: '#FFF', width: '100%', padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#01411C', marginBottom: 5 },
  cardDesc: { color: '#666', fontSize: 14 },
  cardOutline: { width: '100%', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#4CAF50', alignItems: 'center', marginTop: 10 },
  cardOutlineText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  adminBtn: { marginTop: 30 },
  adminBtnText: { color: '#888', textDecorationLine: 'underline' }
});
