import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { createBooking } from '../services/api';

export default function BookingScreen({ route, navigation }) {
  const { teacher, intent } = route.params;
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [timeSlot, setTimeSlot] = useState('Subah (8AM - 12PM)');
  const [mode, setMode] = useState(intent?.mode === 'Online' ? 'Online' : 'Physical');
  const [loading, setLoading] = useState(false);

  const timeSlots = ['Subah (8AM - 12PM)', 'Dopahar (12PM - 4PM)', 'Shaam (4PM - 8PM)'];

  const baseRate = teacher.rate_per_hour;
  let multiplier = 1.0;
  if (mode === 'Online') multiplier *= 0.9;
  if (timeSlot === 'Shaam (4PM - 8PM)') multiplier *= 1.15;
  const totalRate = Math.round(baseRate * multiplier);

  const handleBooking = async () => {
    if (!studentName || !phone) {
      alert("Name aur Phone zaroori hain");
      return;
    }

    setLoading(true);
    try {
      const response = await createBooking({
        teacher_id: teacher.id,
        student_name: studentName,
        phone,
        time_slot: timeSlot,
        mode
      });
      setLoading(false);
      navigation.navigate('Confirmation', { booking: response.booking, teacher });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Booking fail ho gayi");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{color: '#FFF', fontSize: 18}}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Karein</Text>
        <View style={{width: 50}} />
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{teacher.name}</Text>
          <Text style={styles.summarySub}>{teacher.specializations[0]} | Rs.{teacher.rate_per_hour}/hr</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Student Name</Text>
          <TextInput style={styles.input} placeholder="Aapka Naam" value={studentName} onChangeText={setStudentName} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="03XX XXXXXXX" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

          <Text style={styles.label}>Time Slot</Text>
          {timeSlots.map((slot, i) => (
            <TouchableOpacity key={i} style={[styles.radioBtn, timeSlot === slot && styles.radioBtnActive]} onPress={() => setTimeSlot(slot)}>
              <Text style={[styles.radioText, timeSlot === slot && styles.radioTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Mode</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity style={[styles.toggleBtn, mode === 'Physical' && styles.toggleBtnActive]} onPress={() => setMode('Physical')}>
              <Text style={mode === 'Physical' ? styles.activeText : {}}>Physical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, mode === 'Online' && styles.toggleBtnActive]} onPress={() => setMode('Online')}>
              <Text style={mode === 'Online' ? styles.activeText : {}}>Online</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Summary</Text>
          <View style={styles.priceRow}><Text>Base Rate:</Text><Text>Rs.{baseRate}</Text></View>
          {mode === 'Online' && <View style={styles.priceRow}><Text>Online (-10%):</Text><Text>-Rs.{Math.round(baseRate * 0.1)}</Text></View>}
          {timeSlot === 'Shaam (4PM - 8PM)' && <View style={styles.priceRow}><Text>Peak Hours (+15%):</Text><Text>+Rs.{Math.round(baseRate * 0.15)}</Text></View>}
          <View style={styles.priceLine} />
          <View style={styles.priceRow}><Text style={styles.totalText}>Total:</Text><Text style={styles.totalText}>Rs.{totalRate}</Text></View>
          <Text style={styles.priceNote}>Price final confirmation pe</Text>
        </View>

        <View style={styles.whatsappPreview}>
          <Text style={styles.previewTitle}>📱 WhatsApp Preview:</Text>
          <Text style={styles.previewText}>
            Assalam o Alaikum! Aapki booking confirm ho gayi.{'\n'}
            Ustaz: {teacher.name} | Subject: {teacher.specializations[0]}{'\n'}
            Waqt: {timeSlot} | Jagah: {mode}{'\n'}
            Fee: Rs.{totalRate} | Booking ID: BUN-2026-XXXX{'\n'}
            JazakAllah Khair!
          </Text>
        </View>

        <TouchableOpacity style={styles.bookBtn} onPress={handleBooking} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.bookBtnText}>Booking Confirm Karo ✓</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#01411C', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  container: { padding: 20 },
  summaryCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E8F5E9' },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#01411C' },
  summarySub: { color: '#666', marginTop: 5 },
  formSection: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16 },
  radioBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, marginBottom: 10 },
  radioBtnActive: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  radioText: { color: '#1A1A1A' },
  radioTextActive: { color: '#01411C', fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  toggleBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#FFF' },
  toggleBtnActive: { backgroundColor: '#01411C', borderColor: '#01411C' },
  activeText: { color: '#FFF', fontWeight: 'bold' },
  priceCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20 },
  priceTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#1A1A1A' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  priceLine: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  totalText: { fontWeight: 'bold', fontSize: 18, color: '#01411C' },
  priceNote: { color: '#999', fontSize: 12, textAlign: 'right', marginTop: 5 },
  whatsappPreview: { backgroundColor: '#E8F5E9', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  previewTitle: { fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  previewText: { color: '#1B5E20', fontSize: 13, lineHeight: 20 },
  bookBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  bookBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
