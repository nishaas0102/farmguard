import { Menu, Moon, Sun, LogOut, User, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import AlertBell from '../common/AlertBell';
import LanguageSelector from '../common/LanguageSelector';

export default function Navbar({ onToggleSidebar, darkMode, onToggleDark }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
          <Menu size={20} />
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 bg-farm-gradient rounded-xl flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gradient tracking-tight">{t('app_name').toUpperCase()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelector />
        <button onClick={onToggleDark} className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <AlertBell onClick={() => {}} />
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <div className="w-9 h-9 bg-farm-gradient rounded-xl flex items-center justify-center shadow-sm">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-[11px] text-primary-600 dark:text-primary-400 capitalize font-medium">{user?.role === 'admin' ? 'Govt. Official' : user?.role}</p>
          </div>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
