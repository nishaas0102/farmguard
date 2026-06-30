import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import { alertsAPI } from '../../api/alerts';
import { riskAPI } from '../../api/risk';
import StatCard from '../../components/common/StatCard';
import RiskBadge from '../../components/common/RiskBadge';
import { formatDateTime } from '../../utils/dateHelpers';
import { AlertTriangle, Warehouse, BarChart3, Map, Users, ArrowRight, Shield, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
  const [redFarms, setRedFarms] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [farmsRes, alertsRes, riskRes] = await Promise.all([
          farmsAPI.getAll(),
          alertsAPI.getAll(),
          riskAPI.getSummary(),
        ]);

        const farms = farmsRes.data;
        const red = farms.filter((f) => f.risk_score >= 70);
        const yellow = farms.filter((f) => f.risk_score >= 31 && f.risk_score < 70);
        const green = farms.filter((f) => f.risk_score < 31);

        setStats({
          total: farms.length,
          red: red.length,
          yellow: yellow.length,
          green: green.length,
        });
        setRedFarms(red.slice(0, 5));
        setRecentAlerts(alertsRes.data.slice(0, 6));
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
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Shield size={160} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-teal-200" />
            <span className="text-teal-100 text-sm font-medium">{t("government_control_center")}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">{t("system_overview")}</h2>
          <p className="text-teal-100 max-w-lg">Monitor farm risks, review alerts, and analyze antimicrobial usage patterns across all registered farms.</p>
        </div>
      </div>

      {/* High Risk Alert */}
      {stats.red > 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-white dark:from-red-900/30 dark:to-gray-800 p-6 animate-pulse-glow" style={{ animationDuration: '4s' }}>
          <div className="absolute inset-0 farm-pattern opacity-10" />
          <div className="relative z-10 flex items-center gap-4 flex-wrap">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 dark:text-red-300">{stats.red} Farms at HIGH RISK</h2>
              <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">Immediate intervention may be required. Review the Farm Risk List.</p>
            </div>
            <Link to="/admin/farms" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors shadow-lg shadow-red-500/20">
              View High Risk Farms <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Farms" value={stats.total} icon={Warehouse} color="primary" />
        <StatCard title="Red Farms" value={stats.red} icon={AlertTriangle} color="red" />
        <StatCard title="Yellow Farms" value={stats.yellow} icon={TrendingUp} color="yellow" />
        <StatCard title="Green Farms" value={stats.green} icon={Shield} color="green" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent Alerts */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden card-hover">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("recent_alerts")}</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : recentAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield size={40} className="text-primary-300 dark:text-primary-600 mx-auto mb-3" />
                <p className="text-gray-500">{t("no_alerts")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-700/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{alert.farm?.name}</p>
                      </div>
                      {alert.is_read ? (
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">Read</span>
                      ) : (
                        <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-lg font-medium">Unread</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* High Risk Farms */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden card-hover">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("high_risk_farms")}</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
              </div>
            ) : redFarms.length === 0 ? (
              <div className="text-center py-8">
                <Shield size={40} className="text-green-300 dark:text-green-600 mx-auto mb-3" />
                <p className="text-gray-500">{t("no_high_risk")}. Great!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {redFarms.map((farm) => (
                  <Link key={farm.id} to={`/admin/farms/${farm.id}`} className="block rounded-xl bg-gray-50 dark:bg-gray-900/50 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-gray-100 dark:border-gray-700/50 hover:border-red-200 dark:hover:border-red-700/50 group">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-red-700 dark:group-hover:text-red-400">{farm.name}</p>
                      <RiskBadge level="red" size="sm" score={farm.risk_score} />
                    </div>
                  </Link>
                ))}
                <Link to="/admin/farms" className="flex items-center justify-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium pt-2">
                  View all farms <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/farms" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all card-hover group">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-farm-gradient transition-all">
            <Warehouse size={22} className="text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Farm Risk List</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all farms</p>
        </Link>
        <Link to="/admin/analytics" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all card-hover group">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-all">
            <BarChart3 size={22} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Drug usage trends and charts</p>
        </Link>
        <Link to="/admin/resistance-map" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all card-hover group">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-500 transition-all">
            <Map size={22} className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Resistance Radar</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">India heatmap visualization</p>
        </Link>
        <Link to="/admin/audit-log" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-primary-900/5 transition-all card-hover group">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-500 transition-all">
            <Users size={22} className="text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Audit Log</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System activity history</p>
        </Link>
      </div>
    </div>
  );
}
