import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import { animalsAPI } from '../../api/animals';
import toast from 'react-hot-toast';

export default function NewAnimal() {
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState({ farm_id: '', tag_number: '', species: '', breed: '', weight_kg: '', date_of_birth: '', gender: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFarms() {
      try {
        const { data } = await farmsAPI.getAll();
        setFarms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadFarms();
  }, []);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await animalsAPI.create({
        farm_id: form.farm_id,
        tag_number: form.tag_number,
        species: form.species,
        breed: form.breed,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender,
      });
      toast.success('Animal created successfully.');
      navigate('/farmer/animals');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create animal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Animal</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new animal record and link it to a farm.</p>

      {loading ? (
        <p className="text-gray-500 mt-6">Loading farms...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Farm</span>
            <select value={form.farm_id} onChange={(e) => handleChange('farm_id', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white">
              <option value="">Select farm</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tag Number</span>
              <input type="text" value={form.tag_number} onChange={(e) => handleChange('tag_number', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Species</span>
              <select value={form.species} onChange={(e) => handleChange('species', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white">
                <option value="">Select species</option>
                <option value="cattle">Cattle</option>
                <option value="poultry">Poultry</option>
                <option value="goat">Goat</option>
                <option value="sheep">Sheep</option>
                <option value="swine">Swine</option>
                <option value="buffalo">Buffalo</option>
                <option value="fish">Fish</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</span>
              <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => handleChange('weight_kg', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</span>
              <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white">
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</span>
              <input type="date" value={form.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Breed</span>
              <input type="text" value={form.breed} onChange={(e) => handleChange('breed', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
            </label>
          </div>

          <button type="submit" disabled={saving} className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Creating Animal...' : 'Create Animal'}
          </button>
        </form>
      )}
    </div>
  );
}
