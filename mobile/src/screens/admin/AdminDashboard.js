import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../api/axios';
import { useAuthStore } from '../../context/authStore';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [farmsRes, amuRes] = await Promise.all([
        api.get('/farms'),
        api.get('/amu'),
      ]);

      const farms = farmsRes.data;
      const redFarms = farms.filter((f) => f.risk_score >= 70).length;
      const yellowFarms = farms.filter((f) => f.risk_score >= 31 && f.risk_score < 70).length;
      const greenFarms = farms.filter((f) => f.risk_score < 31).length;

      setStats({
        totalFarms: farms.length,
        redFarms,
        yellowFarms,
        greenFarms,
        totalTreatments: amuRes.data.length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#3b82f6" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {stats.redFarms > 0 && (
          <View style={styles.redAlert}>
            <Text style={styles.redAlertTitle}>{stats.redFarms} Farms at HIGH RISK</Text>
            <Text style={styles.redAlertText}>Immediate intervention may be required</Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#3b82f6', borderLeftWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.totalFarms}</Text>
            <Text style={styles.statLabel}>Total Farms</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#ef4444', borderLeftWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.redFarms}</Text>
            <Text style={styles.statLabel}>Red Farms</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#eab308', borderLeftWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.yellowFarms}</Text>
            <Text style={styles.statLabel}>Yellow Farms</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#22c55e', borderLeftWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.greenFarms}</Text>
            <Text style={styles.statLabel}>Green Farms</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Total Treatments</Text>
            <Text style={styles.overviewValue}>{stats.totalTreatments}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Mobile Companion Note</Text>
          <Text style={styles.infoText}>
            This mobile dashboard provides real-time monitoring of farm risk scores and treatment metrics. Full analytics and resistance mapping available on the web portal.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  redAlert: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  redAlertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  redAlertText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  statsGrid: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 12,
    borderColor: '#0284c7',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  infoText: {
    fontSize: 12,
    color: '#0c4a6e',
    marginTop: 6,
  },
});
