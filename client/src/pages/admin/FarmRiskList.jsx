import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import RiskBadge from '../../components/common/RiskBadge';

export default function FarmRiskList() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarms() {
      try {
        const res = await farmsAPI.getAll();
        const sorted = res.data.sort((a, b) => b.risk_score - a.risk_score);
        setFarms(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadFarms();
  }, []);

  if (loading) return <div className="text-center py-12">Loading farms...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Farm Risk List</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sorted by risk score (highest first)</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Farm Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Location</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Risk Score</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Owner</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {farms.map((farm) => (
              <tr key={farm.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{farm.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{farm.district}, {farm.state}</td>
                <td className="px-6 py-4">
                  <RiskBadge level={farm.risk_score >= 70 ? 'red' : farm.risk_score >= 31 ? 'yellow' : 'green'} score={farm.risk_score} />
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{farm.owner?.name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <Link to={`/admin/farms/${farm.id}`} className="text-blue-600 hover:underline">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
