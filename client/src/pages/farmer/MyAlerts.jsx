import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { alertsAPI } from '../../api/alerts';
import { formatDateTime } from '../../utils/dateHelpers';
import { Bell, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

const alertIcons = {
  mrl_violation: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  withdrawal_breach: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  risk_threshold: { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  default: { icon: Bell, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
};

export default function MyAlerts() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const { data } = await alertsAPI.getAll();
        setAlerts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const getAlertStyle = (type) => alertIcons[type] || alertIcons.default;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("my_alerts")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review warnings related to withdrawal, MRL, and risk status</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Alerts</h2>
            {alerts.length > 0 && (
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">{alerts.length}</span>
            )}
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-primary-300 dark:text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No alerts at the moment. Your farm is healthy!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const style = getAlertStyle(alert.type);
                const Icon = style.icon;
                return (
                  <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 hover:border-primary-200 dark:hover:border-primary-700/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                      <Icon size={18} className={style.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{alert.type?.replace('_', ' ')}</p>
                          <h3 className="font-semibold text-gray-900 dark:text-white mt-0.5">{alert.title}</h3>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(alert.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5">{alert.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
