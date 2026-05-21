import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { getAgentLogs } from '../services/api';

export default function AgentLogsScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawView, setRawView] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAgentLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const copyLogs = () => {
    Alert.alert("Copied", "Logs copied to clipboard (simulated)");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Agent Reasoning Trace</Text>
        <Text style={styles.subHeader}>Antigravity Orchestration Log</Text>
      </View>
      
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.btn} onPress={fetchLogs}>
          <Text style={styles.btnText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setRawView(!rawView)}>
          <Text style={styles.btnText}>{rawView ? 'Format View' : 'Raw JSON View'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={copyLogs}>
          <Text style={styles.btnText}>📋 Copy Logs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {rawView ? (
          <View style={styles.rawBox}>
            <Text style={styles.rawText}>{JSON.stringify(logs, null, 2)}</Text>
          </View>
        ) : (
          logs.slice().reverse().map((log, index) => (
            <View key={index} style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.stepTitle}>[STEP: {log.step.toUpperCase()}]</Text>
                <Text style={styles.duration}>{log.duration_ms}ms</Text>
              </View>
              
              <Text style={styles.logLabel}>Input:</Text>
              <Text style={styles.logValue}>{log.input.length > 100 ? log.input.substring(0, 100) + '...' : log.input}</Text>
              
              {log.language_detected && (
                <>
                  <Text style={styles.logLabel}>Language Detected:</Text>
                  <Text style={styles.logValue}>{log.language_detected}</Text>
                </>
              )}
              
              <Text style={styles.logLabel}>Reasoning:</Text>
              <Text style={styles.logValueReasoning}>{log.reasoning}</Text>
              
              <Text style={styles.logLabel}>Confidence:</Text>
              <Text style={styles.logValue}>{Math.round(log.confidence * 100)}%</Text>
              
              <Text style={styles.logLabel}>Output:</Text>
              <Text style={styles.logValueOutput}>{JSON.stringify(log.output, null, 2).substring(0, 200)}...</Text>
              
              <Text style={styles.timestamp}>{new Date(log.timestamp).toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  header: { backgroundColor: '#1A1A1A', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' },
  subHeader: { color: '#888', fontSize: 14, marginTop: 5 },
  toolbar: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: 10, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#333' },
  btn: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#FFF', fontSize: 12 },
  container: { padding: 15 },
  logCard: { backgroundColor: '#1E1E1E', borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stepTitle: { color: '#4CAF50', fontWeight: 'bold', fontSize: 16 },
  duration: { color: '#888', fontSize: 12 },
  logLabel: { color: '#AAA', fontSize: 12, marginTop: 8 },
  logValue: { color: '#FFF', fontSize: 14, marginTop: 2 },
  logValueReasoning: { color: '#FFD54F', fontSize: 14, marginTop: 2, fontStyle: 'italic' },
  logValueOutput: { color: '#81C784', fontSize: 12, marginTop: 2, fontFamily: 'monospace' },
  timestamp: { color: '#555', fontSize: 10, textAlign: 'right', marginTop: 10 },
  rawBox: { backgroundColor: '#1E1E1E', padding: 10, borderRadius: 8 },
  rawText: { color: '#81C784', fontFamily: 'monospace', fontSize: 12 },
});
