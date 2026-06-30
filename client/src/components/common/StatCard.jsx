export default function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
  const colors = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/30',
      icon: 'text-primary-600 dark:text-primary-400',
      gradient: 'from-primary-500 to-primary-600',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      icon: 'text-red-600 dark:text-red-400',
      gradient: 'from-red-500 to-red-600',
    },
    yellow: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      icon: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-amber-600',
    },
    green: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-blue-600',
    },
  };
  const c = colors[color] || colors.primary;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-5 card-hover">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`p-3 rounded-xl ${c.bg}`}>
            <Icon size={22} className={c.icon} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5 truncate">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
