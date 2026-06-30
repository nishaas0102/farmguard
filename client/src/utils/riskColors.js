export function getRiskColor(level) {
  switch (level) {
    case 'red': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', dot: 'bg-red-500', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-300' };
    case 'yellow': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', dot: 'bg-yellow-500', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-300' };
    case 'green': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', dot: 'bg-green-500', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-300' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', dot: 'bg-gray-500', darkBg: 'dark:bg-gray-900/30', darkText: 'dark:text-gray-300' };
  }
}

export function getRiskScoreColor(score) {
  if (score >= 70) return '#ef4444';
  if (score >= 31) return '#eab308';
  return '#22c55e';
}

export function getRiskLevel(score) {
  if (score >= 70) return 'red';
  if (score >= 31) return 'yellow';
  return 'green';
}
