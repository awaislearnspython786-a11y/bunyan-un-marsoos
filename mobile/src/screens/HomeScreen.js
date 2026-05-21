import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('Any');
  const [mode, setMode] = useState('Both');
  
  const chips = ['🕌 Tajweed', '📖 Hifz', '🔤 Nazra', '🌙 Arabic', '📚 General'];
  
  const handleSearch = () => {
    if (!query) {
      alert('Please enter what you are looking for');
      return;
    }
    const finalQuery = `${query}. I prefer a ${gender} teacher. Mode of class: ${mode}.`;
    navigation.navigate('Loading', { query: finalQuery });
  };

  const renderSegmentedControl = (options, state, setState) => (
    <View style={styles.segmentContainer}>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt}
          style={[styles.segmentBtn, state === opt && styles.segmentBtnActive]}
          onPress={() => setState(opt)}
        >
          <Text style={[styles.segmentText, state === opt && styles.segmentTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Assalamu Alaikum,</Text>
        <Text style={styles.headerTitle}>بنیان مرصوص</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        <View style={styles.aiSearchContainer}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="E.g. Mujhe tajweed teacher chahiye G-11"
              placeholderTextColor="#999"
              multiline
              value={query}
              onChangeText={setQuery}
            />
            <View style={styles.sparkleIcon}>
              <Text style={{fontSize: 24}}>✨</Text>
            </View>
          </View>
          <Text style={styles.aiHint}>Powered by Google Gemini AI</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {chips.map((chip, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => setQuery(query + ' ' + chip.split(' ')[1])}>
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.filtersCard}>
          <Text style={styles.sectionTitle}>Teacher Gender Preference</Text>
          {renderSegmentedControl(['Male', 'Female', 'Any'], gender, setGender)}
          
          <Text style={[styles.sectionTitle, {marginTop: 20}]}>Mode of Class</Text>
          {renderSegmentedControl(['Physical', 'Online', 'Both'], mode, setMode)}
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Ustaz Dhundho 🔍</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Recommended Asatiza</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedRow}>
          {/* Mock Recommended Teachers */}
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.teacherCard}>
              <View style={styles.avatar}><Text style={styles.avatarText}>M{item}</Text></View>
              <Text style={styles.teacherName}>Qari Muhammad {item}</Text>
              <Text style={styles.teacherSub}>⭐ 4.9 • Tajweed</Text>
            </View>
          ))}
        </ScrollView>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    backgroundColor: '#01411C',
    padding: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10,
    marginBottom: 15,
  },
  headerSubtitle: { color: '#E8F5E9', fontSize: 16, opacity: 0.8 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  container: { padding: 20, paddingTop: 5 },
  
  aiSearchContainer: { marginBottom: 20 },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  searchInput: { flex: 1, minHeight: 80, textAlignVertical: 'top', fontSize: 16, paddingRight: 10 },
  sparkleIcon: { padding: 10, backgroundColor: '#F1F8E9', borderRadius: 12 },
  aiHint: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold', textAlign: 'right', marginTop: 5, fontStyle: 'italic' },
  
  chipsRow: { flexDirection: 'row', marginBottom: 20, paddingBottom: 10 },
  chip: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  chipText: { color: '#01411C', fontWeight: 'bold' },
  
  filtersCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1A1A1A' },
  
  segmentContainer: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 4 },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  segmentBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  segmentText: { color: '#666', fontWeight: 'bold' },
  segmentTextActive: { color: '#01411C' },
  
  searchButton: { backgroundColor: '#01411C', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 30, shadowColor: '#01411C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  searchButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  recommendedRow: { flexDirection: 'row', paddingBottom: 20 },
  teacherCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginRight: 15, width: 140, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { color: '#01411C', fontWeight: 'bold', fontSize: 18 },
  teacherName: { fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 5 },
  teacherSub: { color: '#666', fontSize: 12 }
});
