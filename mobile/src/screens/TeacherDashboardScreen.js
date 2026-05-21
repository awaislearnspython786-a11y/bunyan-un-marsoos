import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function TeacherDashboardScreen({ route, navigation }) {
  const { user } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Teacher Dashboard</Text>
          <TouchableOpacity onPress={() => navigation.replace('RoleSelection')}>
            <Text style={styles.logoutBtn}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.welcomeText}>Welcome, {user?.name || 'Teacher'}!</Text>
          <Text style={styles.descText}>
            Your profile is now active on Bunyan-un-Marsoos.
            Students can now find you based on your area and specialization.
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Profile Status: <Text style={{color: '#4CAF50'}}>Active</Text></Text>
          <Text style={styles.statsDesc}>You will be notified via WhatsApp when a student books a class with you.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#01411C' },
  logoutBtn: { color: '#D32F2F', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#E8F5E9', padding: 30, borderRadius: 12, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  icon: { fontSize: 50, marginBottom: 10 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20', marginBottom: 10, textAlign: 'center' },
  descText: { fontSize: 16, color: '#2E7D32', textAlign: 'center', lineHeight: 24 },
  statsCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  statsTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  statsDesc: { fontSize: 14, color: '#666', lineHeight: 22 }
});
