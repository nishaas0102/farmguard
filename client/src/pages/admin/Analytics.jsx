import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { riskAPI } from '../../api/risk';
import { amuAPI } from '../../api/amu';

export default function Analytics() {
  const [amuTrends, setAmuTrends] = useState([]);
  const [drugUsage, setDrugUsage] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [riskRes, amuRes] = await Promise.all([
          riskAPI.getSummary(),
          amuAPI.getAll(),
        ]);

        // Process trends data
        const treatmentsByMonth = {};
        amuRes.data.forEach((log) => {
          const month = new Date(log.treatment_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          treatmentsByMonth[month] = (treatmentsByMonth[month] || 0) + 1;
        });

        setAmuTrends(
          Object.entries(treatmentsByMonth)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([month, count]) => ({ month, treatments: count }))
        );

        // Drug usage distribution
        const drugCounts = {};
        amuRes.data.forEach((log) => {
          const drugName = log.drug?.name || 'Unknown';
          drugCounts[drugName] = (drugCounts[drugName] || 0) + 1;
        });

        setDrugUsage(
          Object.entries(drugCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        );

        // Risk distribution
        const riskCounts = { Red: 0, Yellow: 0, Green: 0 };
        riskRes.data?.forEach?.((farm) => {
          if (farm.risk_score >= 70) riskCounts.Red += 1;
          else if (farm.risk_score >= 31) riskCounts.Yellow += 1;
          else riskCounts.Green += 1;
        });

        setRiskDistribution(
          Object.entries(riskCounts).map(([name, value]) => ({ name, value }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) return <div className="text-center py-12">Loading analytics...</div>;

  const COLORS = ['#ef4444', '#eab308', '#22c55e'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">AMU trends and risk distribution</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Treatment Trends</h2>
          {amuTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={amuTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="treatments" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Distribution</h2>
          {riskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Drugs Used</h2>
        {drugUsage.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={drugUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
}
