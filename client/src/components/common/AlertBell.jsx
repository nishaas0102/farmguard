import { Bell } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

export default function AlertBell({ onClick }) {
  const { unreadCount } = useAlerts();
  return (
    <button onClick={onClick} className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
