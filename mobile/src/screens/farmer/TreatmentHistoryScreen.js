import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import api from '../../api/axios';

export default function TreatmentHistoryScreen() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await api.get('/amu');
      setTreatments(res.data.sort((a, b) => new Date(b.treatment_start_date) - new Date(a.treatment_start_date)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#3b82f6" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Treatment History</Text>
      </View>

      {treatments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No treatments recorded</Text>
        </View>
      ) : (
        <FlatList
          data={treatments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.animalTag}>{item.animal?.tag_number}</Text>
                <Text style={styles.date}>{new Date(item.treatment_start_date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.drug}>{item.drug?.name}</Text>
              <Text style={styles.detail}>Dosage: {item.dosage} {item.dosage_unit}</Text>
              <Text style={styles.detail}>Frequency: {item.frequency}</Text>
              <Text style={styles.detail}>Duration: {item.duration_days} days</Text>
              <Text style={styles.detail}>Safe to Sell: {new Date(item.safe_sale_date).toLocaleDateString()}</Text>
              {item.notes && <Text style={styles.notes}>Notes: {item.notes}</Text>}
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  animalTag: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  drug: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  detail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
