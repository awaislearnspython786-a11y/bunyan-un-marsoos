import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated, Alert } from 'react-native';

export default function ConfirmationScreen({ route, navigation }) {
  const { booking, teacher } = route.params;
  const [showLogs, setShowLogs] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.successIconBox, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.successIcon}>✅</Text>
        </Animated.View>
        <Text style={styles.successTitle}>Booking Ho Gayi! 🎉</Text>
        <Text style={styles.bookingId}>{booking.booking_id}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}><Text style={styles.label}>Ustaz:</Text><Text style={styles.value}>{teacher.name}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.label}>Subject:</Text><Text style={styles.value}>{teacher.specializations[0]}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.label}>Waqt:</Text><Text style={styles.value}>{booking.time_slot}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.label}>Mode:</Text><Text style={styles.value}>{booking.mode}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.label}>Fee:</Text><Text style={styles.valueBold}>Rs.{booking.final_price}</Text></View>
        </View>

        <View style={styles.whatsappBox}>
          <Text style={styles.whatsappText}>{booking.whatsapp_message}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => Alert.alert('WhatsApp', 'Simulated: Message sent to WhatsApp!')}
          >
            <Text style={styles.primaryBtnText}>📱 WhatsApp Pe Bhejo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.outlineBtn} 
            onPress={() => Alert.alert('Reminder', 'Reminder set ho gaya!')}
          >
            <Text style={styles.outlineBtnText}>⏰ Reminder Set Karo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.outlineBtn} 
            onPress={() => navigation.navigate('HomeTabs')}
          >
            <Text style={styles.outlineBtnText}>🔍 Naya Dhundho</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logToggle} onPress={() => setShowLogs(!showLogs)}>
          <Text style={styles.logToggleText}>🤖 AI ne kya kiya {showLogs ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showLogs && (
          <View style={styles.logBox}>
            <Text style={styles.logStep}>Step 1: Intent Parsed</Text>
            <Text style={styles.logText}>Extracted request details from input.</Text>
            
            <Text style={styles.logStep}>Step 2: Teachers Matched</Text>
            <Text style={styles.logText}>Scored 20 teachers. {teacher.name} scored highest.</Text>
            
            <Text style={styles.logStep}>Step 3: Booking Executed</Text>
            <Text style={styles.logText}>Calculated dynamic price Rs.{booking.final_price}. Generated ID {booking.booking_id}.</Text>
            
            <Text style={styles.logStep}>Step 4: Follow-up Scheduled</Text>
            <Text style={styles.logText}>Set WhatsApp reminder for 1 hour before class.</Text>
            
            <TouchableOpacity onPress={() => navigation.navigate('AILogs')} style={{marginTop: 10}}>
              <Text style={{color: '#4CAF50', fontWeight: 'bold', textAlign: 'center'}}>View Full AI Trace Logs →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { padding: 20, alignItems: 'center' },
  successIconBox: { marginTop: 20, marginBottom: 10 },
  successIcon: { fontSize: 80 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#01411C', marginBottom: 5 },
  bookingId: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20, backgroundColor: '#E8F5E9', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  summaryCard: { width: '100%', backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#666', fontSize: 16 },
  value: { color: '#1A1A1A', fontSize: 16, fontWeight: '500' },
  valueBold: { color: '#01411C', fontSize: 18, fontWeight: 'bold' },
  whatsappBox: { width: '100%', backgroundColor: '#E8F5E9', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#4CAF50' },
  whatsappText: { color: '#1B5E20', fontSize: 14, lineHeight: 22 },
  actionButtons: { width: '100%', marginBottom: 30 },
  primaryBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  outlineBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  outlineBtnText: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  logToggle: { padding: 10, backgroundColor: '#E0E0E0', borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 },
  logToggleText: { color: '#333', fontWeight: 'bold' },
  logBox: { width: '100%', backgroundColor: '#1A1A1A', padding: 15, borderRadius: 8, marginTop: 10 },
  logStep: { color: '#4CAF50', fontWeight: 'bold', marginTop: 10, fontSize: 14 },
  logText: { color: '#CCC', fontSize: 12, marginTop: 2 },
});
