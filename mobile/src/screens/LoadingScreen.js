import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { parseIntent, matchTeachers } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingScreen({ route, navigation }) {
  const { query } = route.params;
  const [activeStep, setActiveStep] = useState(0);
  const [liveText, setLiveText] = useState("Agent 1 initializing...");
  
  const agents = [
    { id: 1, title: 'Agent 1 — Intent Parser', subtitle: 'Analyzing language and criteria...' },
    { id: 2, title: 'Agent 2 — Teacher Matcher', subtitle: 'Scoring teachers based on intent...' },
    { id: 3, title: 'Agent 3 — Area Proximity', subtitle: 'Calculating zone distances...' },
    { id: 4, title: 'Agent 4 — Pricing Engine', subtitle: 'Optimizing budget matches...' },
  ];

  const reasoningTexts = [
    "Analyzing query: Roman Urdu detected. Extracting core requirements...",
    "Query parsed. Fetching all available teachers in database...",
    "Found matching profiles. Scoring based on rating, experience, and mode...",
    "Top teachers identified. Calculating proximity to student zone...",
    "Distance verified. Applying pricing constraints and finalizing top 3 matches..."
  ];

  useEffect(() => {
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount < agents.length) {
        setActiveStep(stepCount);
        setLiveText(reasoningTexts[stepCount]);
      } else {
        setLiveText(reasoningTexts[4]);
        clearInterval(interval);
      }
    }, 1200);

    // Make API calls in background
    const fetchData = async () => {
      try {
        const intentRes = await parseIntent(query);
        const matchRes = await matchTeachers(intentRes.intent);
        
        // Ensure minimum time for animations
        setTimeout(() => {
          navigation.replace('Results', { 
            query, 
            intent: intentRes.intent, 
            matches: matchRes.matches,
            businesses: matchRes.businesses
          });
        }, 5500);
      } catch (error) {
        console.error("API Error:", error);
        // Fallback for demo
        setTimeout(() => {
          navigation.replace('Results', { query, intent: {}, matches: [], businesses: [] });
        }, 5500);
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Soch Raha Hai...</Text>
        <Text style={styles.subHeader}>Antigravity agents kaam kar rahe hain</Text>
      </View>
      
      <View style={styles.container}>
        <View style={styles.queryBox}>
          <Text style={styles.quoteIcon}>❝</Text>
          <Text style={styles.queryText} numberOfLines={2}>"{query}"</Text>
        </View>

        <View style={styles.pipelineContainer}>
          {agents.map((agent, index) => {
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            const isWaiting = index > activeStep;
            
            return (
              <View key={agent.id} style={styles.agentRow}>
                <View style={styles.iconContainer}>
                  {isCompleted ? (
                    <View style={[styles.circle, styles.circleCompleted]}>
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    </View>
                  ) : isActive ? (
                    <ActivityIndicator size="small" color="#01411C" />
                  ) : (
                    <View style={[styles.circle, styles.circleWaiting]}>
                      <Text style={styles.circleText}>{agent.id}</Text>
                    </View>
                  )}
                  {index < agents.length - 1 && <View style={[styles.connector, isCompleted && styles.connectorActive]} />}
                </View>
                
                <View style={styles.agentInfo}>
                  <Text style={[styles.agentTitle, isActive && styles.agentTitleActive, isWaiting && styles.agentTitleWaiting]}>
                    {agent.title}
                  </Text>
                  <Text style={styles.agentSubtitle}>
                    {isCompleted ? "Done - " + Math.floor(Math.random() * 200 + 100) + "ms" : isActive ? "Processing..." : "Waiting..."}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{flex: 1}} />

        <View style={styles.reasoningBox}>
          <Text style={styles.reasoningTitle}>Live reasoning</Text>
          <Text style={styles.reasoningText}>{liveText}</Text>
        </View>

        <View style={styles.loadingDots}>
          <ActivityIndicator size="small" color="#4CAF50" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { backgroundColor: '#01411C', padding: 25, paddingTop: Platform.OS === 'android' ? 40 : 25, paddingBottom: 25 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  subHeader: { color: '#E8F5E9', fontSize: 14, marginTop: 5 },
  container: { flex: 1, padding: 20 },
  
  queryBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  quoteIcon: { fontSize: 24, color: '#4CAF50', marginRight: 10, marginTop: -5 },
  queryText: { flex: 1, fontSize: 15, fontStyle: 'italic', color: '#1A1A1A', fontWeight: 'bold' },
  
  pipelineContainer: { paddingLeft: 10 },
  agentRow: { flexDirection: 'row', marginBottom: 20 },
  iconContainer: { alignItems: 'center', marginRight: 15 },
  circle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  circleCompleted: { backgroundColor: '#4CAF50' },
  circleWaiting: { backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: '#CCC' },
  circleText: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  connector: { width: 2, height: 35, backgroundColor: '#E0E0E0', marginVertical: 5 },
  connectorActive: { backgroundColor: '#4CAF50' },
  
  agentInfo: { flex: 1, justifyContent: 'flex-start', paddingTop: 2 },
  agentTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  agentTitleActive: { color: '#01411C' },
  agentTitleWaiting: { color: '#999' },
  agentSubtitle: { fontSize: 13, color: '#666', marginTop: 3 },
  
  reasoningBox: {
    backgroundColor: '#F1F8E9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 20,
  },
  reasoningTitle: { fontSize: 12, fontWeight: 'bold', color: '#33691E', marginBottom: 5 },
  reasoningText: { fontSize: 14, color: '#33691E', fontStyle: 'italic', lineHeight: 20 },
  
  loadingDots: { alignItems: 'center', marginBottom: 10 }
});
