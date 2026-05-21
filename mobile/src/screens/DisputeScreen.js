import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { submitDispute } from '../services/api';

export default function DisputeScreen() {
  const [bookingId, setBookingId] = useState('');
  const [issueType, setIssueType] = useState('no-show');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const issues = [
    { id: 'no-show', label: '😤 Teacher Nahi Aaya' },
    { id: 'quality', label: '📉 Quality Issue' },
    { id: 'price', label: '💰 Price Dispute' },
    { id: 'other', label: '❓ Kuch Aur' }
  ];

  const handleSubmit = async () => {
    if (!bookingId) {
      alert("Booking ID zaroori hai");
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await submitDispute({
        booking_id: bookingId,
        issue_type: issueType,
        description: description
      });
      setResult(response.resolution);
    } catch (e) {
      console.error(e);
      alert("Error submitting dispute");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚠️ Masla Report Karein</Text>
      </View>
      
      <View style={styles.container}>
        <Text style={styles.label}>Booking ID</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. BUN-2026-1234" 
          value={bookingId} 
          onChangeText={setBookingId} 
        />

        <Text style={styles.label}>Kya Masla Hai?</Text>
        {issues.map((issue) => (
          <TouchableOpacity 
            key={issue.id} 
            style={[styles.radioBtn, issueType === issue.id && styles.radioBtnActive]} 
            onPress={() => setIssueType(issue.id)}
          >
            <Text style={[styles.radioText, issueType === issue.id && styles.radioTextActive]}>{issue.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Tafseel (Description)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Masla bayan karein..." 
          multiline 
          value={description} 
          onChangeText={setDescription} 
        />

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>✅ Aapka masla note ho gaya</Text>
            <View style={styles.aiDecisionBox}>
              <Text style={styles.aiTitle}>🤖 AI Decision:</Text>
              <Text style={styles.aiText}>{result.resolution}</Text>
              <Text style={styles.aiCompensation}>Compensation: {result.compensation}</Text>
            </View>
            <TouchableOpacity style={styles.btnOutline} onPress={() => setResult(null)}>
              <Text style={styles.btnOutlineText}>Naya Masla Report Karein</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Karein</Text>}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#B71C1C', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  container: { padding: 20, flex: 1 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10, marginTop: 10 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  radioBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 15, marginBottom: 10 },
  radioBtnActive: { borderColor: '#B71C1C', backgroundColor: '#FFEBEE' },
  radioText: { color: '#1A1A1A', fontSize: 16 },
  radioTextActive: { color: '#B71C1C', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#B71C1C', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  resultBox: { marginTop: 20 },
  resultTitle: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  aiDecisionBox: { backgroundColor: '#E8F5E9', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#4CAF50', marginBottom: 20 },
  aiTitle: { color: '#2E7D32', fontWeight: 'bold', marginBottom: 5 },
  aiText: { color: '#1B5E20', fontSize: 16, marginBottom: 5 },
  aiCompensation: { color: '#D32F2F', fontWeight: 'bold' },
  btnOutline: { borderWidth: 1, borderColor: '#B71C1C', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnOutlineText: { color: '#B71C1C', fontWeight: 'bold' },
});
