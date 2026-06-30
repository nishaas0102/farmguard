import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AMUTrendLine({ data }) {
  if (!data || data.length === 0) return <p className="text-gray-500 text-sm">No data</p>;
  const chartData = data.map(d => ({
    week: d.get?.('week') || d.week,
    total: parseInt(d.get?.('log_count') || d.log_count || 0),
    overdoses: parseInt(d.get?.('overdose_count') || d.overdose_count || 0),
    mrl: parseInt(d.get?.('mrl_count') || d.mrl_count || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} name="Total AMU" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="overdoses" stroke="#ef4444" strokeWidth={2} name="Overdoses" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="mrl" stroke="#eab308" strokeWidth={2} name="MRL Violations" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
