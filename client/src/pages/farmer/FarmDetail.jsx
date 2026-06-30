import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import { animalsAPI } from '../../api/animals';
import { amuAPI } from '../../api/amu';
import RiskBadge from '../../components/common/RiskBadge';
import WithdrawalCountdown from '../../components/common/WithdrawalCountdown';
import { formatDateTime } from '../../utils/dateHelpers';
import { ArrowLeft, MapPin, User, PawPrint, Syringe, Bell, ArrowRight } from 'lucide-react';

const speciesEmoji = { cattle: '🐄', poultry: '🐔', goat: '🐐', sheep: '🐑', swine: '🐷', buffalo: '🐃' };

export default function FarmDetail() {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarm() {
      try {
        const [farmRes, animalsRes, amuRes] = await Promise.all([
          farmsAPI.getOne(id),
          animalsAPI.getAll(id),
          amuAPI.getAll({ farm_id: id }),
        ]);
        setFarm(farmRes.data);
        setAnimals(animalsRes.data);
        setTreatments(amuRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadFarm();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!farm) return <div className="text-center py-20 text-gray-500">Farm not found.</div>;

  const riskLevel = farm.risk_score >= 70 ? 'red' : farm.risk_score >= 31 ? 'yellow' : 'green';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/farmer/farms" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{farm.name}</h1>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-0.5">
            <MapPin size={14} />
            <span className="text-sm">{farm.district}, {farm.state}</span>
          </div>
        </div>
        <RiskBadge level={riskLevel} score={farm.risk_score} size="md" />
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <User size={16} />
            <span className="text-sm font-medium">Owner</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{farm.owner?.name || 'Unknown'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <PawPrint size={16} />
            <span className="text-sm font-medium">Animals</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{animals.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Syringe size={16} />
            <span className="text-sm font-medium">Treatments</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{treatments.length}</p>
        </div>
      </div>

      {/* Active Withdrawal Periods */}
      {treatments.filter(t => t.safe_sale_date && new Date(t.safe_sale_date) > new Date()).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Withdrawal Periods</h3>
          {treatments.filter(t => t.safe_sale_date && new Date(t.safe_sale_date) > new Date()).slice(0, 3).map(t => (
            <WithdrawalCountdown key={t.id} safeSaleDate={t.safe_sale_date} productName={`${t.drug?.name || 'Drug'} (${t.animal?.tag_number || 'Animal'})`} />
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Animals */}
          <section className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Animals on this Farm</h2>
              <Link to="/farmer/animals" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
            </div>
            <div className="p-4">
              {animals.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No animals registered for this farm.</p>
              ) : (
                <div className="space-y-2">
                  {animals.map((animal) => (
                    <Link key={animal.id} to={`/farmer/animals/${animal.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700/50 border border-gray-100 dark:border-gray-700/50 transition-colors group">
                      <span className="text-xl">{speciesEmoji[animal.species] || '🐾'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 truncate">{animal.tag_number}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{animal.species} • {animal.weight_kg} kg</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-primary-500" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Treatments */}
          <section className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Treatments</h2>
              <Link to="/farmer/log-treatment" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Log new</Link>
            </div>
            <div className="p-4">
              {treatments.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No treatment history for this farm.</p>
              ) : (
                <div className="space-y-2">
                  {treatments.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{log.drug?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Animal {log.animal?.tag_number}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(log.treatment_start_date)}</span>
                      </div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-1.5">Safe sale: {log.safe_sale_date ? formatDateTime(log.safe_sale_date) : 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Actions */}
        <section className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Farm Actions</h2>
          <div className="space-y-2">
            <Link to="/farmer/log-treatment" className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
              <div className="w-10 h-10 bg-farm-gradient rounded-xl flex items-center justify-center">
                <Syringe size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700">Log Treatment</p>
                <p className="text-xs text-gray-500">Record a new antibiotic treatment</p>
              </div>
            </Link>
            <Link to="/farmer/alerts" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Bell size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700">Review Alerts</p>
                <p className="text-xs text-gray-500">Check and manage alerts</p>
              </div>
            </Link>
            <Link to="/farmer/animals" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <PawPrint size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700">Manage Animals</p>
                <p className="text-xs text-gray-500">View and edit animal records</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
