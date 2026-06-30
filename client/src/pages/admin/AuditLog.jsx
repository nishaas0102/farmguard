import { useEffect, useState } from 'react';
import { alertsAPI } from '../../api/alerts';
import { formatDateTime } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await alertsAPI.getAll();
      setLogs(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load audit log');
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(id) {
    try {
      await alertsAPI.resolve(id);
      setLogs(logs.map((log) => (log.id === id ? { ...log, is_read: true } : log)));
      toast.success('Alert marked as resolved');
    } catch (error) {
      console.error(error);
      toast.error('Failed to resolve alert');
    }
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.type === filter);

  const getActionBadge = (type) => {
    const colors = {
      treatment_alert: 'bg-red-100 text-red-700',
      risk_alert: 'bg-yellow-100 text-yellow-700',
      safe_sale_alert: 'bg-green-100 text-green-700',
      withdrawal_alert: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="text-center py-12">Loading audit log...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">System activity and event history</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter('treatment_alert')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'treatment_alert' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
        >
          Treatments
        </button>
        <button
          onClick={() => setFilter('risk_alert')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'risk_alert' ? 'bg-yellow-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
        >
          Risk Changes
        </button>
        <button
          onClick={() => setFilter('safe_sale_alert')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'safe_sale_alert' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
        >
          Safe to Sell
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No events found.</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadge(log.type)}`}>
                        {log.type?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{formatDateTime(log.createdAt)}</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{log.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.message}</p>
                    {log.farm && <p className="text-xs text-gray-500 mt-2">Farm: {log.farm.name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!log.is_read && (
                      <button
                        onClick={() => handleResolve(log.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition"
                      >
                        Resolve
                      </button>
                    )}
                    {log.is_read && <span className="text-xs text-gray-400">Resolved</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
