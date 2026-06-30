import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#2dd4bf', '#5eead4', '#99f6e4'];

export default function DrugUsageBar({ data }) {
  if (!data || data.length === 0) return <p className="text-gray-500 text-sm">No data</p>;
  const chartData = data.map(d => ({
    name: d.drug?.name?.split(' ')[0] || 'Unknown',
    count: parseInt(d.get?.('usage_count') || d.usage_count || 0),
    category: d.drug?.who_category || '',
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
