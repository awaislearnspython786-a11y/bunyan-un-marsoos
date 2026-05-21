import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { signupTeacher } from '../services/api';

export default function TeacherSignupScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '', experience: '', area_of_interest: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const handleSignup = async () => {
    if (!form.name || !form.phone || !form.area_of_interest || !form.password) {
      alert('Please fill required fields (Name, Phone, Interest, Password)');
      return;
    }
    
    // Strict Pakistani Phone Validation
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      alert('Invalid Phone Number. Must be exactly 11 digits starting with 03 (e.g. 03001234567).');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await signupTeacher(form);
      if (res.success) {
        // Auto-login straight to dashboard
        navigation.replace('TeacherDashboard', { user: res });
      } else {
        alert('Signup failed');
      }
    } catch (e) {
      alert('Error during signup');
    }
    setLoading(false);
  };

  const getStyle = (inputName) => [
    styles.input,
    activeInput === inputName && styles.inputActive
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text style={styles.headerIcon}>👨‍🏫</Text>
            <Text style={styles.title}>Teacher Registration</Text>
            <Text style={styles.subtitle}>Join our network of Quran educators.</Text>
          </View>
          
          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput 
              style={getStyle('name')} 
              onFocus={() => setActiveInput('name')}
              onBlur={() => setActiveInput(null)}
              value={form.name} 
              onChangeText={(t) => setForm({...form, name: t})} 
            />

            <Text style={styles.label}>Address</Text>
            <TextInput 
              style={getStyle('address')} 
              onFocus={() => setActiveInput('address')}
              onBlur={() => setActiveInput(null)}
              value={form.address} 
              onChangeText={(t) => setForm({...form, address: t})} 
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput 
              style={getStyle('phone')} 
              onFocus={() => setActiveInput('phone')}
              onBlur={() => setActiveInput(null)}
              keyboardType="phone-pad" 
              placeholder="03XX XXXXXXX" 
              value={form.phone} 
              onChangeText={(t) => setForm({...form, phone: t})} 
            />

            <Text style={styles.label}>Experience (Years)</Text>
            <TextInput 
              style={getStyle('experience')} 
              onFocus={() => setActiveInput('experience')}
              onBlur={() => setActiveInput(null)}
              keyboardType="numeric" 
              value={form.experience} 
              onChangeText={(t) => setForm({...form, experience: t})} 
            />

            <Text style={styles.label}>Area of Interest (e.g., Tajweed, Hifz) *</Text>
            <TextInput 
              style={getStyle('area')} 
              onFocus={() => setActiveInput('area')}
              onBlur={() => setActiveInput(null)}
              value={form.area_of_interest} 
              onChangeText={(t) => setForm({...form, area_of_interest: t})} 
            />

            <Text style={styles.label}>Password *</Text>
            <TextInput 
              style={getStyle('password')} 
              onFocus={() => setActiveInput('password')}
              onBlur={() => setActiveInput(null)}
              secureTextEntry 
              placeholder="Create a strong password" 
              value={form.password} 
              onChangeText={(t) => setForm({...form, password: t})} 
            />

            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput 
              style={getStyle('confirmPassword')} 
              onFocus={() => setActiveInput('confirmPassword')}
              onBlur={() => setActiveInput(null)}
              secureTextEntry 
              placeholder="Type password again" 
              value={form.confirmPassword} 
              onChangeText={(t) => setForm({...form, confirmPassword: t})} 
            />

            <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Register as Teacher</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={{marginTop: 20, paddingBottom: 20}} onPress={() => navigation.goBack()}>
              <Text style={{color: '#4CAF50', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>← Back to Roles</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#01411C' },
  container: { flexGrow: 1 },
  headerContainer: { padding: 30, alignItems: 'center', backgroundColor: '#01411C' },
  headerIcon: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subtitle: { color: '#E8F5E9', fontSize: 15, marginTop: 5, textAlign: 'center' },
  formCard: { flex: 1, backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingTop: 30, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 15, padding: 16, fontSize: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  inputActive: { borderColor: '#4CAF50', backgroundColor: '#F1F8E9' },
  btn: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
