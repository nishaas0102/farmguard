import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { animalsAPI } from '../../api/animals';
import { drugsAPI } from '../../api/drugs';
import { amuAPI } from '../../api/amu';
import VoiceInputButton from '../../components/common/VoiceInputButton';
import DrugInteractionWarning from '../../components/common/DrugInteractionWarning';
import { Syringe, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LogTreatment() {
  const { t } = useTranslation();
  const [animals, setAnimals] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState({ animal_id: '', drug_id: '', dosage: '', dosage_unit: '', frequency: '', duration_days: '', reason: '', treatment_start_date: '', vet_id: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOptions() {
      try {
        const [animalRes, drugRes] = await Promise.all([
          animalsAPI.getAll(),
          drugsAPI.getAll(),
        ]);
        setAnimals(animalRes.data);
        setDrugs(drugRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

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
      await amuAPI.create(form);
      toast.success('Treatment logged successfully.');
      navigate('/farmer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log treatment');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("log_treatment")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Record a new antimicrobial treatment for your livestock</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-farm-gradient rounded-lg flex items-center justify-center">
              <Syringe size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Treatment Details</h2>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Animal & Drug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Animal *</span>
                  <select value={form.animal_id} onChange={(e) => handleChange('animal_id', e.target.value)} required className={inputClass}>
                    <option value="">Select animal</option>
                    {animals.map((animal) => (
                      <option key={animal.id} value={animal.id}>{animal.tag_number} ({animal.species})</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Drug *</span>
                  <select value={form.drug_id} onChange={(e) => handleChange('drug_id', e.target.value)} required className={inputClass}>
                    <option value="">Select drug</option>
                    {drugs.map((drug) => (
                      <option key={drug.id} value={drug.id}>{drug.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Dosage */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Dosage *</span>
                  <input type="number" value={form.dosage} onChange={(e) => handleChange('dosage', e.target.value)} required placeholder="e.g. 500" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Dosage Unit *</span>
                  <input type="text" value={form.dosage_unit} onChange={(e) => handleChange('dosage_unit', e.target.value)} required placeholder="e.g. mg, ml" className={inputClass} />
                </label>
              </div>

              {/* Frequency & Duration */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Frequency *</span>
                  <input type="text" value={form.frequency} onChange={(e) => handleChange('frequency', e.target.value)} required placeholder="e.g. 2 times daily" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Duration (days) *</span>
                  <input type="number" value={form.duration_days} onChange={(e) => handleChange('duration_days', e.target.value)} required placeholder="e.g. 5" className={inputClass} />
                </label>
              </div>

              {/* Date & Vet */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Treatment Start Date *</span>
                  <input type="date" value={form.treatment_start_date} onChange={(e) => handleChange('treatment_start_date', e.target.value)} required className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Vet Name / ID *</span>
                  <input type="text" value={form.vet_id} onChange={(e) => handleChange('vet_id', e.target.value)} required placeholder="Prescribing veterinarian" className={inputClass} />
                </label>
              </div>

              {/* Reason */}
              <label className="block">
                <span className={labelClass}>Reason</span>
                <input type="text" value={form.reason} onChange={(e) => handleChange('reason', e.target.value)} placeholder="e.g. Respiratory infection" className={inputClass} />
              </label>

              {/* Notes */}
              <label className="block">
                <span className={labelClass}>Notes</span>
                <div className="relative">
                  <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows="3" placeholder="Additional observations..." className={inputClass + ' pr-12'} />
                  <div className="absolute right-2 top-2">
                    <VoiceInputButton onResult={(text) => handleChange('notes', form.notes ? form.notes + ' ' + text : text)} />
                  </div>
                </div>
              </label>

              {/* Drug Interaction Warning */}
              {interactions.length > 0 && (
                <div>
                  <span className={labelClass}>Drug Interactions</span>
                  <div className="mt-1.5">
                    <DrugInteractionWarning interactions={interactions} />
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 btn-teal text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Syringe size={18} />
                      Save Treatment
                    </>
                  )}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
