import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function TeacherProfileScreen({ route, navigation }) {
  const { teacher, intent } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{color: '#FFF', fontSize: 18}}>← Back</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>{teacher.name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{teacher.name} {teacher.verified && <Text style={styles.verified}>✓</Text>}</Text>
          <Text style={styles.rating}>⭐ {teacher.rating} ({teacher.total_reviews} reviews)</Text>
          <Text style={styles.experience}>{teacher.experience_years} saal ka tajruba</Text>
        </View>

        <View style={styles.tagsContainer}>
          {teacher.specializations.map((spec, i) => (
            <View key={i} style={styles.tag}><Text style={styles.tagText}>{spec}</Text></View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detailText}>📍 Areas: {teacher.areas.join(', ') || 'Online Only'}</Text>
          <Text style={styles.detailText}>Mode: {teacher.mode}</Text>
          <Text style={styles.detailText}>Bio: {teacher.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.grid}>
            {Object.keys(teacher.availability).map((day, i) => (
              <View key={i} style={styles.gridItem}>
                <Text style={styles.day}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <Text style={styles.time}>{teacher.availability[day].join(', ')}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}><Text>Base Rate:</Text><Text>Rs.{teacher.rate_per_hour}/hour</Text></View>
          {teacher.mode === 'Online' || intent?.mode === 'Online' ? (
            <View style={styles.priceRow}><Text>Online Discount:</Text><Text>-Rs.{teacher.rate_per_hour * 0.1}</Text></View>
          ) : null}
          <View style={styles.priceLine} />
          <View style={styles.priceRow}><Text style={styles.totalText}>Estimated Rate:</Text><Text style={styles.totalText}>Rs.{teacher.mode === 'Online' || intent?.mode === 'Online' ? teacher.rate_per_hour * 0.9 : teacher.rate_per_hour}/class</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewBox}><Text>"Bohat acha ustaz hai" — Ahmad, G-11</Text></View>
          <View style={styles.reviewBox}><Text>"Bachon ke saath bahut patient" — Sara, F-7</Text></View>
          <View style={styles.reviewBox}><Text>"Tajweed bahut improve hui" — Ali, G-9</Text></View>
        </View>

        <TouchableOpacity 
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { teacher, intent })}
        >
          <Text style={styles.bookBtnText}>Abhi Book Karo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#01411C', padding: 15 },
  container: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#01411C', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarTextLarge: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  verified: { color: '#4CAF50' },
  rating: { fontSize: 16, color: '#666', marginTop: 5 },
  experience: { fontSize: 14, color: '#4CAF50', marginTop: 5, fontWeight: '500' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  tag: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, margin: 4 },
  tagText: { color: '#01411C', fontWeight: 'bold' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  detailText: { fontSize: 15, color: '#444', marginBottom: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#FFF', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  day: { fontWeight: 'bold', color: '#01411C', marginBottom: 4 },
  time: { color: '#666', fontSize: 13 },
  priceCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20 },
  priceTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#1A1A1A' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  priceLine: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  totalText: { fontWeight: 'bold', fontSize: 16, color: '#01411C' },
  reviewBox: { backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8, marginBottom: 8, fontStyle: 'italic', color: '#555' },
  bookBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  bookBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
