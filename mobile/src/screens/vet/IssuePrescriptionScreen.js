import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import api from '../../api/axios';
import { useQRScanner } from '../../utils/qrScanner';
import { offlineSyncStore } from '../../utils/offlineSync';
import Toast from 'react-native-toast-message';
import { Camera } from 'expo-camera';

export default function IssuePrescriptionScreen() {
  const [scannerActive, setScannerActive] = useState(false);
  const [animalTag, setAnimalTag] = useState('');
  const [farm, setFarm] = useState(null);
  const [animal, setAnimal] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [farms, setFarms] = useState([]);
  const [formData, setFormData] = useState({
    farm_id: '',
    animal_id: '',
    drug_id: '',
    dosage: '',
    dosage_unit: 'mg',
    frequency: '',
    duration_days: '',
    reason: '',
    treatment_start_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { permission, scanned, setScanned, handleBarCodeScanned } = useQRScanner();

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [drugsRes, farmsRes] = await Promise.all([
        api.get('/drugs'),
        api.get('/farms'),
      ]);
      setDrugs(drugsRes.data);
      setFarms(farmsRes.data);
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Failed to load data' });
    }
  }

  async function searchAnimal(tag) {
    setAnimalTag(tag);
    try {
      const res = await api.get(`/animals?tag_number=${tag}`);
      if (res.data.length > 0) {
        const foundAnimal = res.data[0];
        setAnimal(foundAnimal);
        setFarm(foundAnimal.farm);
        setFormData((prev) => ({
          ...prev,
          farm_id: foundAnimal.farm_id,
          animal_id: foundAnimal.id,
        }));
      } else {
        Toast.show({ type: 'error', text1: 'Animal not found' });
        setAnimal(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleQRScanned = async (data) => {
    setScanned(true);
    await searchAnimal(data);
    setScannerActive(false);
  };

  async function handleSubmit() {
    if (!animal || !formData.drug_id || !formData.dosage || !formData.frequency || !formData.duration_days) {
      Toast.show({ type: 'error', text1: 'Please fill all required fields' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/amu', formData);
      Toast.show({ type: 'success', text1: 'Prescription issued successfully' });
      setFormData({
        farm_id: '',
        animal_id: '',
        drug_id: '',
        dosage: '',
        dosage_unit: 'mg',
        frequency: '',
        duration_days: '',
        reason: '',
        treatment_start_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setAnimal(null);
      setAnimalTag('');
    } catch (error) {
      if (error.response?.status === 503) {
        await offlineSyncStore.addToQueue({
          method: 'POST',
          endpoint: '/amu',
          data: formData,
        });
        Toast.show({ type: 'info', text1: 'Saved offline. Will sync when online.' });
      } else {
        Toast.show({ type: 'error', text1: error.response?.data?.message || 'Failed to issue prescription' });
      }
    } finally {
      setLoading(false);
    }
  }

  if (scannerActive && permission) {
    return (
      <Camera
        style={styles.camera}
        type="back"
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
      >
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setScannerActive(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Issue Prescription</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Animal</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Animal Tag Number"
              value={animalTag}
              onChangeText={setAnimalTag}
              editable={!animal}
            />
            <TouchableOpacity style={styles.scanButton} onPress={() => setScannerActive(true)}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          {animal && (
            <View style={styles.animalInfo}>
              <Text style={styles.infoLabel}>Selected: {animal.tag_number}</Text>
              <Text style={styles.infoLabel}>Species: {animal.species}</Text>
              <Text style={styles.infoLabel}>Farm: {farm?.name}</Text>
              <TouchableOpacity onPress={() => setAnimal(null)}>
                <Text style={styles.changeLink}>Change Animal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription Details</Text>

          <Text style={styles.label}>Drug *</Text>
          <View style={styles.selectPlaceholder}>
            <Text style={styles.selectPlaceholderText}>
              {formData.drug_id ? `Drug ${formData.drug_id}` : 'Select Drug'}
            </Text>
          </View>

          <View style={styles.twoColumnGrid}>
            <View style={styles.column}>
              <Text style={styles.label}>Dosage *</Text>
              <TextInput
                style={styles.input}
                placeholder="Dosage"
                value={formData.dosage}
                onChangeText={(v) => setFormData({ ...formData, dosage: v })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Frequency *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2x daily"
                value={formData.frequency}
                onChangeText={(v) => setFormData({ ...formData, frequency: v })}
              />
            </View>
          </View>

          <Text style={styles.label}>Duration (Days) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Duration"
            value={formData.duration_days}
            onChangeText={(v) => setFormData({ ...formData, duration_days: v })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.input}
            placeholder="Reason for prescription"
            value={formData.reason}
            onChangeText={(v) => setFormData({ ...formData, reason: v })}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes"
            value={formData.notes}
            onChangeText={(v) => setFormData({ ...formData, notes: v })}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Issue Prescription</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: '#111827', marginBottom: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputGroup: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  scanButton: { backgroundColor: '#10b981', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center', minWidth: 70 },
  animalInfo: { backgroundColor: '#e0f2fe', borderRadius: 8, padding: 12, marginTop: 12, borderColor: '#0284c7', borderWidth: 1 },
  infoLabel: { fontSize: 14, color: '#0c4a6e', marginBottom: 4 },
  changeLink: { fontSize: 14, color: '#0284c7', fontWeight: 'bold', marginTop: 8 },
  twoColumnGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  column: { flex: 1 },
  selectPlaceholder: { backgroundColor: '#fff', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center', marginBottom: 12 },
  selectPlaceholderText: { fontSize: 14, color: '#6b7280' },
  submitButton: { backgroundColor: '#3b82f6', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 16 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});
