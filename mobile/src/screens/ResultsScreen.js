import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';

export default function ResultsScreen({ route, navigation }) {
  const { query, intent, matches, businesses } = route.params;

  // Custom UI Component for Mock Radar Map
  const MockRadarMap = () => (
    <View style={styles.radarContainer}>
      <View style={styles.radarGrid}>
        {/* Horizontal grid lines */}
        <View style={styles.hLine} /><View style={styles.hLine} /><View style={styles.hLine} />
        {/* Vertical grid lines */}
        <View style={[styles.vLine, {left: '33%'}]} />
        <View style={[styles.vLine, {left: '66%'}]} />
        
        {/* Dots */}
        <View style={[styles.dot, styles.dotYou, { top: 40, left: 150 }]} />
        <View style={[styles.dotLabelBox, { top: 60, left: 130 }]}><Text style={styles.dotLabel}>You: {intent?.location || 'Area'}</Text></View>
        
        <View style={[styles.dot, styles.dotTeacher, { top: 30, left: 90 }]} />
        <Text style={[styles.dotLabelSmall, { top: 45, left: 95 }]}>T1</Text>
        
        <View style={[styles.dot, styles.dotTeacher, { top: 65, left: 200 }]} />
        <Text style={[styles.dotLabelSmall, { top: 80, left: 205 }]}>T2</Text>

        <View style={[styles.dot, styles.dotNearby, { top: 80, left: 110 }]} />
        <Text style={[styles.dotLabelSmall, { top: 95, left: 100, color: '#999' }]}>Masjid</Text>
      </View>
      <View style={styles.radarLegend}>
        <View style={styles.legendItem}><View style={[styles.dotLegend, {backgroundColor: '#2196F3'}]} /><Text style={styles.legendText}>Teacher</Text></View>
        <View style={styles.legendItem}><View style={[styles.dotLegend, {backgroundColor: '#9E9E9E'}]} /><Text style={styles.legendText}>Nearby</Text></View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top 3 Asatiza Milein! 🎉</Text>
        <Text style={styles.subHeader}>{matches?.length || 0} results • Ranked by AI score</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.sectionTitle}>Area Proximity Map</Text>
        <MockRadarMap />

        {matches && matches.length > 0 ? (
          matches.map((match, index) => (
            <View key={match.teacher.id} style={[styles.card, index === 0 && styles.cardBestMatch]}>
              {index === 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>Best Match — {match.total_score}/100</Text>
                </View>
              )}
              
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{match.teacher.name.substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.name}>{match.teacher.name}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.rating}>⭐ {match.teacher.rating} ({match.teacher.total_reviews})</Text>
                    {match.teacher.verified && <Text style={styles.verified}> ✓</Text>}
                  </View>
                </View>
                <Text style={styles.price}>Rs.{match.teacher.rate_per_hour}/hr</Text>
              </View>

              <View style={styles.tagsRow}>
                <View style={styles.tag}><Text style={styles.tagText}>{match.teacher.specializations[0]}</Text></View>
                <View style={[styles.tag, {backgroundColor: '#E3F2FD'}]}><Text style={[styles.tagText, {color: '#1565C0'}]}>{match.teacher.mode}</Text></View>
                <View style={[styles.tag, {backgroundColor: '#FFF3E0'}]}><Text style={[styles.tagText, {color: '#E65100'}]}>{match.teacher.areas[0] || 'Online'}</Text></View>
              </View>

              <View style={styles.aiReasoningBox}>
                <Text style={styles.aiTitle}>AI Reasoning</Text>
                <Text style={styles.aiText}>{match.reasoning}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.bookBtn}
                  onPress={() => navigation.navigate('Booking', { teacher: match.teacher, intent })}
                >
                  <Text style={styles.bookBtnText}>Book Karo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileBtn}
                  onPress={() => navigation.navigate('TeacherProfile', { teacher: match.teacher, intent })}
                >
                  <Text style={styles.profileBtnText}>Profile Dekho</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{textAlign: 'center', marginTop: 50}}>No teachers found for this criteria.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#01411C', padding: 25, paddingTop: Platform.OS === 'android' ? 40 : 25, paddingBottom: 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  subHeader: { color: '#E8F5E9', fontSize: 14, marginTop: 5 },
  container: { padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10, marginLeft: 5 },
  
  radarContainer: { backgroundColor: '#222', borderRadius: 15, padding: 15, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  radarGrid: { height: 120, position: 'relative', overflow: 'hidden' },
  hLine: { height: 1, backgroundColor: '#333', width: '100%', marginBottom: 39 },
  vLine: { width: 1, backgroundColor: '#333', height: '100%', position: 'absolute' },
  dot: { width: 14, height: 14, borderRadius: 7, position: 'absolute', borderWidth: 2, borderColor: '#FFF' },
  dotYou: { backgroundColor: '#01411C', width: 18, height: 18, borderRadius: 9, borderWidth: 3 },
  dotTeacher: { backgroundColor: '#2196F3' },
  dotNearby: { backgroundColor: '#9E9E9E', borderColor: '#444' },
  dotLabelBox: { position: 'absolute', backgroundColor: '#FFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dotLabel: { fontSize: 10, fontWeight: 'bold', color: '#01411C' },
  dotLabelSmall: { position: 'absolute', fontSize: 10, color: '#2196F3', fontWeight: 'bold' },
  radarLegend: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  dotLegend: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  legendText: { color: '#AAA', fontSize: 11 },

  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: '#EEE' },
  cardBestMatch: { borderColor: '#4CAF50', borderWidth: 2 },
  badgeContainer: { position: 'absolute', top: -12, left: 15, backgroundColor: '#01411C', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F8E9', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#C8E6C9' },
  avatarText: { color: '#01411C', fontSize: 18, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  rating: { fontSize: 14, color: '#666', marginTop: 2 },
  verified: { color: '#4CAF50', fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap' },
  tag: { backgroundColor: '#F1F8E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 10, marginBottom: 5, borderWidth: 1, borderColor: '#E8F5E9' },
  tagText: { color: '#33691E', fontSize: 12, fontWeight: 'bold' },
  
  aiReasoningBox: { backgroundColor: '#F9FBE7', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#F0F4C3' },
  aiTitle: { fontSize: 12, fontWeight: 'bold', color: '#827717', marginBottom: 5 },
  aiText: { fontSize: 14, color: '#558B2F', fontStyle: 'italic', lineHeight: 20 },
  
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  bookBtn: { flex: 1, backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center', marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  profileBtn: { flex: 1, backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center' },
  profileBtnText: { color: '#333', fontWeight: 'bold', fontSize: 15 },
});
