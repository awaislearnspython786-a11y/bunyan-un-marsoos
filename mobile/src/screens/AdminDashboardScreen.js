import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { getAdminDashboard } from '../services/api';

export default function AdminDashboardScreen({ navigation }) {
  const [data, setData] = useState({ teachers: [], students: [], deals: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deals');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (activeTab === 'deals') {
      return data.deals.map((deal, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{deal.booking_id}</Text>
          <Text style={styles.cardText}>Student: {deal.student_name}</Text>
          <Text style={styles.cardText}>Teacher ID: {deal.teacher_id}</Text>
          <Text style={styles.cardTextBold}>Amount: Rs.{deal.final_price}</Text>
          <Text style={styles.cardText}>Date: {new Date(deal.created_at).toLocaleDateString()}</Text>
        </View>
      ));
    }
    if (activeTab === 'teachers') {
      return data.teachers.map((teacher, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{teacher.name}</Text>
          <Text style={styles.cardText}>ID: {teacher.id}</Text>
          <Text style={styles.cardText}>Specialization: {teacher.specializations?.join(', ')}</Text>
          <Text style={styles.cardText}>Experience: {teacher.experience_years} years</Text>
        </View>
      ));
    }
    if (activeTab === 'students') {
      return data.students.map((student, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{student.name}</Text>
          <Text style={styles.cardText}>Phone: {student.phone}</Text>
          <Text style={styles.cardText}>Address: {student.address}</Text>
        </View>
      ));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.replace('RoleSelection')}><Text style={{color: '#FFF'}}>Logout</Text></TouchableOpacity>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{data.teachers.length}</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{data.students.length}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{data.deals.length}</Text>
          <Text style={styles.statLabel}>Deals</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, activeTab === 'deals' && styles.tabActive]} onPress={() => setActiveTab('deals')}>
          <Text style={[styles.tabText, activeTab === 'deals' && styles.tabTextActive]}>Closed Deals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'teachers' && styles.tabActive]} onPress={() => setActiveTab('teachers')}>
          <Text style={[styles.tabText, activeTab === 'teachers' && styles.tabTextActive]}>Teachers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'students' && styles.tabActive]} onPress={() => setActiveTab('students')}>
          <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>Students</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? <ActivityIndicator size="large" color="#01411C" /> : renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#1A1A1A', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', padding: 15, justifyContent: 'space-between' },
  statBox: { backgroundColor: '#FFF', flex: 1, margin: 5, padding: 15, borderRadius: 8, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#01411C' },
  statLabel: { fontSize: 12, color: '#666' },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderColor: '#01411C' },
  tabText: { color: '#666', fontWeight: 'bold' },
  tabTextActive: { color: '#01411C' },
  container: { padding: 15 },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  cardText: { fontSize: 14, color: '#444', marginBottom: 2 },
  cardTextBold: { fontSize: 14, fontWeight: 'bold', color: '#01411C', marginBottom: 2 },
});
