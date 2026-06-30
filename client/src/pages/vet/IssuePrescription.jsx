import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import { animalsAPI } from '../../api/animals';
import { drugsAPI } from '../../api/drugs';
import { amuAPI } from '../../api/amu';
import { farmsAPI } from '../../api/farms';
import VoiceInputButton from '../../components/common/VoiceInputButton';
import DrugInteractionWarning from '../../components/common/DrugInteractionWarning';
import toast from 'react-hot-toast';

export default function IssuePrescription() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState({ farm_id: '', animal_id: '', drug_id: '', dosage: '', dosage_unit: '', frequency: '', duration_days: '', reason: '', treatment_start_date: '', vet_id: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [farmsRes, animalsRes, drugsRes] = await Promise.all([
          farmsAPI.getAll(),
          animalsAPI.getAll(),
          drugsAPI.getAll(),
        ]);
        setFarms(farmsRes.data);
        setAnimals(animalsRes.data);
        setDrugs(drugsRes.data);

        if (editId) {
          const { data } = await amuAPI.getOne(editId);
          setForm({
            farm_id: data.farm_id,
            animal_id: data.animal_id,
            drug_id: data.drug_id,
            dosage: data.dosage,
            dosage_unit: data.dosage_unit,
            frequency: data.frequency,
            duration_days: data.duration_days,
            reason: data.reason,
            treatment_start_date: data.treatment_start_date,
            vet_id: data.vet_id || '',
            notes: data.notes || '',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, [editId]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'drug_id' && value) {
      const selectedDrug = drugs.find(d => d.id === Number(value));
      if (selectedDrug) {
        drugsAPI.checkInteractions([selectedDrug.name]).then(res => {
          setInteractions(res.data.interactions || []);
        }).catch(() => setInteractions([]));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await amuAPI.update(editId, form);
        toast.success('Prescription updated successfully.');
      } else {
        await amuAPI.create(form);
        toast.success('Prescription issued successfully.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save prescription');
    } finally {
      setSaving(false);
    }
  };

  const createPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('FarmGuard Prescription', 14, 20);
    doc.setFontSize(12);
    doc.text(`Farm: ${farms.find((farm) => farm.id === Number(form.farm_id))?.name || ''}`, 14, 34);
    doc.text(`Animal Tag: ${animals.find((animal) => animal.id === Number(form.animal_id))?.tag_number || ''}`, 14, 42);
    doc.text(`Drug: ${drugs.find((drug) => drug.id === Number(form.drug_id))?.name || ''}`, 14, 50);
    doc.text(`Dosage: ${form.dosage} ${form.dosage_unit}`, 14, 58);
    doc.text(`Frequency: ${form.frequency}`, 14, 66);
    doc.text(`Duration: ${form.duration_days} days`, 14, 74);
    doc.text(`Vet: ${form.vet_id}`, 14, 82);
    doc.text(`Start Date: ${form.treatment_start_date}`, 14, 90);
    doc.text(`Notes: ${form.notes}`, 14, 98);
    doc.text('Signature: __________________________', 14, 110);
    doc.save('farmguard-prescription.pdf');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Prescription' : 'Issue Prescription'}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create or update a prescription for a farm animal.</p>

      {loading ? (
        <p className="text-gray-500 mt-6">Loading prescription editor...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Farm</span>
              <select value={form.farm_id} onChange={(e) => handleChange('farm_id', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white">
                <option value="">Select farm</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>{farm.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Animal</span>
              <select value={form.animal_id} onChange={(e) => handleChange('animal_id', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white">
                <option value="">Select animal</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>{animal.tag_number} ({animal.species})</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Drug</span>
              <select value={form.drug_id} onChange={(e) => handleChange('drug_id', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white">
                <option value="">Select drug</option>
                {drugs.map((drug) => (
                  <option key={drug.id} value={drug.id}>{drug.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</span>
              <input type="number" value={form.dosage} onChange={(e) => handleChange('dosage', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dosage Unit</span>
              <input type="text" value={form.dosage_unit} onChange={(e) => handleChange('dosage_unit', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</span>
              <input type="text" value={form.frequency} onChange={(e) => handleChange('frequency', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (days)</span>
              <input type="number" value={form.duration_days} onChange={(e) => handleChange('duration_days', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Treatment Start Date</span>
              <input type="date" value={form.treatment_start_date} onChange={(e) => handleChange('treatment_start_date', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vet Name / ID</span>
              <input type="text" value={form.vet_id} onChange={(e) => handleChange('vet_id', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</span>
              <input type="text" value={form.reason} onChange={(e) => handleChange('reason', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
            <div className="relative">
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows="4" className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 pr-12 text-gray-900 dark:text-white" />
              <div className="absolute right-3 top-5">
                <VoiceInputButton onResult={(text) => handleChange('notes', form.notes ? form.notes + ' ' + text : text)} />
              </div>
            </div>
          </label>

          {interactions.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Drug Interactions</span>
              <div className="mt-1.5">
                <DrugInteractionWarning interactions={interactions} />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
              {saving ? 'Saving...' : editId ? 'Update Prescription' : 'Issue Prescription'}
            </button>
            <button type="button" onClick={createPdf} className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition">
              Export PDF
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
