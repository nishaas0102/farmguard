import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getRiskScoreColor } from '../../utils/riskColors';

export default function RiskGauge({ score, size = 160 }) {
  const data = [
    { value: score },
    { value: 100 - score },
  ];
  const color = getRiskScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            startAngle={180} endAngle={0}
            innerRadius="65%" outerRadius="85%"
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}
