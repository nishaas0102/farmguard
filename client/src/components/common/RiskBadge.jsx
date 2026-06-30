import { getRiskColor } from '../../utils/riskColors';

export default function RiskBadge({ level, score, size = 'sm' }) {
  const c = getRiskColor(level);
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const icons = {
    green: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
    ),
    yellow: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M4 0L8 8H0L4 0Z"/></svg>
    ),
    red: (
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><rect width="8" height="8" rx="1.5"/></svg>
    ),
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${c.bg} ${c.text} ${c.darkBg} ${c.darkText} ${sizes[size]}`}>
      {icons[level] || icons.green}
      {level?.toUpperCase()}
      {score !== undefined && <span className="opacity-70 font-medium">({score})</span>}
    </span>
  );
}
