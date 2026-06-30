import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { farmsAPI } from '../../api/farms';
import { animalsAPI } from '../../api/animals';
import { alertsAPI } from '../../api/alerts';
import { amuAPI } from '../../api/amu';
import StatCard from '../../components/common/StatCard';
import RiskBadge from '../../components/common/RiskBadge';
import WeatherDiseaseAlerts from '../../components/common/WeatherDiseaseAlerts';
import { formatDateTime } from '../../utils/dateHelpers';
import { PawPrint, Syringe, Bell, CalendarCheck, Shield, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ totalAnimals: 0, activeTreatments: 0, unreadAlerts: 0, nextSafeSale: null });
  const [latestAlerts, setLatestAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [animalsRes, alertsRes, amuRes] = await Promise.all([
          animalsAPI.getAll(),
          alertsAPI.getAlerts({ is_read: false }),
          amuAPI.getAll({ farm_id: undefined }),
        ]);

        const animals = animalsRes.data;
        const alerts = alertsRes.data;
        const amuLogs = amuRes.data;

        const activeTreatments = amuLogs.filter((log) => new Date(log.treatment_end_date) >= new Date()).length;

        const upcoming = amuLogs
          .filter((log) => log.safe_sale_date)
          .sort((a, b) => new Date(a.safe_sale_date) - new Date(b.safe_sale_date))[0];

        setStats({
          totalAnimals: animals.length,
          activeTreatments,
          unreadAlerts: alerts.length,
          nextSafeSale: upcoming?.safe_sale_date || null,
        });
        setLatestAlerts(alerts.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-farm-gradient rounded-2xl p-6 lg:p-8">
        <div className="absolute inset-0 farm-pattern opacity-30" />
        {/* Decorative cow silhouette */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-10">
          <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
            <path d="M50 110c0-30 20-60 50-60s50 30 50 60" stroke="white" strokeWidth="3" fill="none"/>
            <circle cx="75" cy="70" r="6" fill="white"/>
            <circle cx="125" cy="70" r="6" fill="white"/>
            <ellipse cx="100" cy="88" rx="15" ry="8" fill="white" opacity="0.3"/>
            <path d="M60 55c-8-15-3-25 3-28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M140 55c8-15 3-25-3-28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="62" y="110" width="6" height="25" rx="3" fill="white" opacity="0.4"/>
            <rect x="90" y="110" width="6" height="25" rx="3" fill="white" opacity="0.4"/>
            <rect x="105" y="110" width="6" height="25" rx="3" fill="white" opacity="0.4"/>
            <rect x="132" y="110" width="6" height="25" rx="3" fill="white" opacity="0.4"/>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sprout size={20} className="text-teal-200" />
            <span className="text-teal-100 text-sm font-medium">Farmer Dashboard</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">Welcome to your Farm</h2>
          <p className="text-teal-100 max-w-lg">Monitor your livestock health, track treatments, and ensure MRL compliance all in one place.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard title={t("total_animals")} value={stats.totalAnimals} icon={PawPrint} color="primary" />
        <StatCard title={t("active_treatments")} value={stats.activeTreatments} icon={Syringe} color="blue" />
        <StatCard title={t("unread_alerts")} value={stats.unreadAlerts} icon={Bell} color={stats.unreadAlerts > 0 ? 'red' : 'green'} />
        <StatCard title={t("next_safe_sale")} value={stats.nextSafeSale ? formatDateTime(stats.nextSafeSale) : 'N/A'} icon={CalendarCheck} color="green" />
      </div>

      {/* Content Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden card-hover">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('farm_health_summary')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recent alerts and treatment overview</p>
              </div>
              <RiskBadge level={stats.unreadAlerts > 0 ? 'yellow' : 'green'} />
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : latestAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield size={40} className="text-primary-300 dark:text-primary-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No unread alerts. Your farm is healthy!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {latestAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700/50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-gray-900 dark:text-white">{alert.title}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(alert.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5">{alert.message}</p>
                  </div>
                ))}
                <Link to="/farmer/alerts" className="flex items-center justify-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium pt-2">
                  View all alerts <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 card-hover">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("quick_actions")}</h2>
            <div className="space-y-2">
              <Link to="/farmer/log-treatment" className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                <div className="w-10 h-10 bg-farm-gradient rounded-xl flex items-center justify-center">
                  <Syringe size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">{t("log_treatment")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Record a new antimicrobial treatment</p>
                </div>
              </Link>
              <Link to="/farmer/animals/new" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <PawPrint size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">{t("add_animal")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Register a new animal to your farm</p>
                </div>
              </Link>
              <Link to="/farmer/farms" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Shield size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">{t("view_farms")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check farm risk scores and details</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 card-hover">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t("risk_insights")}</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Farm risk scores update automatically when treatments are logged.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Keep withdrawal periods clear to avoid MRL violations.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Animal treatment history is fully traceable per animal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
