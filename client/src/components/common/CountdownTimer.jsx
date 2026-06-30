import { daysUntil, formatDate } from '../../utils/dateHelpers';

export default function CountdownTimer({ date, label = 'Safe sale' }) {
  const days = daysUntil(date);
  if (days === null) return <span className="text-gray-400 text-sm">N/A</span>;

  if (days <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        {label}: Cleared
      </span>
    );
  }

  const urgent = days <= 3;
  return (
    <div className="text-sm">
      <span className={`font-semibold ${urgent ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
        {days} day{days !== 1 ? 's' : ''} remaining
      </span>
      <span className="text-gray-400 ml-1">({formatDate(date)})</span>
    </div>
  );
}
