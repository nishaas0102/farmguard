import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import { amuAPI } from '../../api/amu';
import StatCard from '../../components/common/StatCard';

export default function AssignedFarms() {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarms() {
      try {
        const farmsRes = await farmsAPI.getAll();
        setFarms(farmsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadFarms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard title="Total Farms" value={farms.length} />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t("assigned_farms")}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review the farms you can work with as a vet.</p>
          </div>
          <Link to="/vet/prescribe" className="inline-flex items-center px-4 py-2 rounded-2xl bg-primary-600 text-white hover:bg-primary-700">Issue Prescription</Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading farms...</p>
        ) : farms.length === 0 ? (
          <p className="text-gray-500">No farms available.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {farms.map((farm) => (
              <Link key={farm.id} to={`/farmer/farms/${farm.id}`} className="block rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5 hover:border-primary-500 transition">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{farm.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{farm.district}, {farm.state}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
