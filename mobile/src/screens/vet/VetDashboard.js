import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import api from '../../api/axios';
import { useAuthStore } from '../../context/authStore';

export default function VetDashboard({ navigation }) {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [farmsRes, animalsRes, amuRes] = await Promise.all([
        api.get('/farms'),
        api.get('/animals'),
        api.get('/amu'),
      ]);

      const userPrescriptions = amuRes.data.filter(
        (log) => log.loggedBy?.id === user?.id
      ).sort((a, b) => new Date(b.treatment_start_date) - new Date(a.treatment_start_date));

      setStats({
        farms: farmsRes.data.length,
        animals: animalsRes.data.length,
        prescriptions: userPrescriptions.length,
      });
      setPrescriptions(userPrescriptions.slice(0, 5));
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
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.farms}</Text>
            <Text style={styles.statLabel}>Farms</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.animals}</Text>
            <Text style={styles.statLabel}>Animals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.prescriptions}</Text>
            <Text style={styles.statLabel}>Prescriptions</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Prescriptions</Text>
          {prescriptions.length === 0 ? (
            <Text style={styles.emptyText}>No prescriptions yet</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={prescriptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.prescriptionCard}>
                  <Text style={styles.prescriptionDrug}>{item.drug?.name}</Text>
                  <Text style={styles.prescriptionDetail}>Animal: {item.animal?.tag_number}</Text>
                  <Text style={styles.prescriptionDetail}>Farm: {item.farm?.name}</Text>
                  <Text style={styles.prescriptionDetail}>Date: {new Date(item.treatment_start_date).toLocaleDateString()}</Text>
                </View>
              )}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('PrescribeTab')}
        >
          <Text style={styles.buttonText}>Issue Prescription</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
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
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  prescriptionDrug: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 6,
  },
  prescriptionDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
