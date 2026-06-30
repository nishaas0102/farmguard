import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import StatCard from '../../components/common/StatCard';
import RiskBadge from '../../components/common/RiskBadge';
import { Warehouse, Plus, MapPin, ArrowRight } from 'lucide-react';

export default function MyFarms() {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getRiskLevel = (score) => {
    if (score >= 70) return 'red';
    if (score >= 31) return 'yellow';
    return 'green';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("my_farms")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your farms and monitor risk levels</p>
        </div>
        <Link to="/farmer/farms/new" className="inline-flex items-center gap-2 px-5 py-2.5 btn-teal text-white rounded-xl font-semibold text-sm">
          <Plus size={16} /> Add Farm
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Farms" value={farms.length} icon={Warehouse} color="primary" />
        <StatCard title="High Risk" value={farms.filter(f => f.risk_score >= 70).length} color="red" />
        <StatCard title="Medium Risk" value={farms.filter(f => f.risk_score >= 31 && f.risk_score < 70).length} color="yellow" />
        <StatCard title="Low Risk" value={farms.filter(f => f.risk_score < 31).length} color="green" />
      </div>

      {/* Farm List */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Farms</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : farms.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse size={48} className="text-primary-300 dark:text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No farms found. Add one to start tracking AMU and risk.</p>
              <Link to="/farmer/farms/new" className="inline-flex items-center gap-2 px-5 py-2.5 btn-teal text-white rounded-xl font-semibold text-sm">
                <Plus size={16} /> Add Your First Farm
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {farms.map((farm) => (
                <Link key={farm.id} to={`/farmer/farms/${farm.id}`} className="block p-5 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all card-hover group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 truncate">{farm.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 dark:text-gray-400">
                        <MapPin size={14} />
                        <span className="text-sm">{farm.district}, {farm.state}</span>
                      </div>
                    </div>
                    <RiskBadge level={getRiskLevel(farm.risk_score)} score={farm.risk_score} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-primary-600 dark:text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View details <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
