import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter Phone Number and password');
      return;
    }

    if (username !== 'admin') {
      const phoneRegex = /^03\d{9}$/;
      if (!phoneRegex.test(username)) {
        alert('Invalid Phone Number. Must be exactly 11 digits starting with 03.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        if (res.role === 'admin') {
          navigation.replace('AdminDashboard');
        } else if (res.role === 'teacher') {
          navigation.replace('TeacherDashboard', { user: res });
        } else {
          navigation.replace('HomeTabs');
        }
      } else {
        alert(res.message || 'Login failed');
      }
    } catch (e) {
      alert('Error logging in');
    }
    setLoading(false);
  };

  const getStyle = (inputName) => [
    styles.input,
    activeInput === inputName && styles.inputActive
  ];

  const getPasswordStyle = () => [
    styles.passwordContainer,
    activeInput === 'password' && styles.inputActive
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text style={styles.headerIcon}>🔐</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue to your account.</Text>
          </View>
          
          <View style={styles.formCard}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={getStyle('phone')} 
              onFocus={() => setActiveInput('phone')}
              onBlur={() => setActiveInput(null)}
              keyboardType="phone-pad"
              placeholder="03XX XXXXXXX (or 'admin')" 
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Password</Text>
            <View style={getPasswordStyle()}>
              <TextInput 
                style={styles.passwordInput} 
                onFocus={() => setActiveInput('password')}
                onBlur={() => setActiveInput(null)}
                placeholder="Enter password" 
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Text style={{fontSize: 18}}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Login</Text>}
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
  headerContainer: { padding: 30, alignItems: 'center', backgroundColor: '#01411C', marginTop: 20 },
  headerIcon: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subtitle: { color: '#E8F5E9', fontSize: 16, marginTop: 5, textAlign: 'center' },
  formCard: { flex: 1, backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingTop: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 15, padding: 16, fontSize: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  passwordInput: { flex: 1, padding: 16, fontSize: 16 },
  eyeIcon: { padding: 16 },
  inputActive: { borderColor: '#4CAF50', backgroundColor: '#F1F8E9' },
  btn: { backgroundColor: '#01411C', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#01411C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
