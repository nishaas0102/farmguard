import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import toast from 'react-hot-toast';

export default function NewFarm() {
  const [form, setForm] = useState({ name: '', location: '', district: '', state: '', area_acres: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await farmsAPI.create({
        name: form.name,
        location: form.location,
        district: form.district,
        state: form.state,
        area_acres: form.area_acres ? parseFloat(form.area_acres) : null,
      });
      toast.success('Farm created successfully.');
      navigate('/farmer/farms');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create farm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Farm</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a farm record to begin tracking animals and AMU.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Farm Name</span>
            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">District</span>
            <input type="text" value={form.district} onChange={(e) => handleChange('district', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">State</span>
            <input type="text" value={form.state} onChange={(e) => handleChange('state', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Area (acres)</span>
            <input type="number" step="0.01" value={form.area_acres} onChange={(e) => handleChange('area_acres', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
          <input type="text" value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white" />
        </label>
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
          {saving ? 'Creating Farm...' : 'Create Farm'}
        </button>
      </form>
    </div>
  );
}
