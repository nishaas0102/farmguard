import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmsAPI } from '../../api/farms';
import { animalsAPI } from '../../api/animals';
import { amuAPI } from '../../api/amu';
import StatCard from '../../components/common/StatCard';
import { formatDateTime } from '../../utils/dateHelpers';
import { Warehouse, PawPrint, ClipboardList, Stethoscope, ArrowRight, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VetDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({ farms: 0, animals: 0, prescriptions: 0 });
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [farmsRes, animalsRes, amuRes] = await Promise.all([
          farmsAPI.getAll(),
          animalsAPI.getAll(),
          amuAPI.getAll(),
        ]);

        const myPrescriptions = amuRes.data.filter((log) => log.loggedBy?.id === user.id);
        setStats({
          farms: farmsRes.data.length,
          animals: animalsRes.data.length,
          prescriptions: myPrescriptions.length,
        });
        setPrescriptions(myPrescriptions.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user.id]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prescription? This cannot be undone.')) return;
    try {
      await amuAPI.delete(id);
      setPrescriptions((current) => current.filter((item) => item.id !== id));
      setStats((prev) => ({ ...prev, prescriptions: prev.prescriptions - 1 }));
      toast.success('Prescription deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete prescription');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-farm-gradient rounded-2xl p-6 lg:p-8">
        <div className="absolute inset-0 farm-pattern opacity-30" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-10">
          <Stethoscope size={140} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope size={20} className="text-teal-200" />
            <span className="text-teal-100 text-sm font-medium">Veterinarian Dashboard</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Welcome, Dr. {user?.name}</h2>
          <p className="text-teal-100 max-w-lg">Manage assigned farms, issue prescriptions, and track treatment outcomes.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-3">
        <StatCard title="Total Farms" value={stats.farms} icon={Warehouse} color="primary" />
        <StatCard title="Total Animals" value={stats.animals} icon={PawPrint} color="green" />
        <StatCard title="My Prescriptions" value={stats.prescriptions} icon={ClipboardList} color="blue" />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/vet/prescribe" className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all card-hover group">
          <div className="w-12 h-12 bg-farm-gradient rounded-xl flex items-center justify-center shrink-0">
            <Plus size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">{t("new_prescription")}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Issue a new treatment prescription</p>
          </div>
        </Link>
        <Link to="/vet/farms" className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all card-hover group">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
            <Warehouse size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">View Assigned Farms</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Browse farms and their risk status</p>
          </div>
        </Link>
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden card-hover">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("recent_prescriptions")}</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList size={40} className="text-primary-300 dark:text-primary-600 mx-auto mb-3" />
              <p className="text-gray-500">{t("no_prescriptions")}</p>
              <Link to="/vet/prescribe" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium mt-2">
                Create your first prescription <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((log) => (
                <div key={log.id} className="rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 p-4 hover:border-primary-200 dark:hover:border-primary-700/50 transition-colors">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{log.drug?.name} prescribed for {log.animal?.tag_number}</p>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{log.animal?.species || 'Animal'}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Farm: {log.farm?.name || 'Unknown'}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(log.createdAt)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link to={`/vet/prescribe?edit=${log.id}`} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm font-medium transition">Edit</Link>
                    <button onClick={() => handleDelete(log.id)} className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
