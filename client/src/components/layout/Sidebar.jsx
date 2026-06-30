import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Warehouse, Stethoscope, Pill, ClipboardList, Bell, BarChart3, Map, Users, X, Shield, Sprout } from 'lucide-react';

const farmerLinks = [
  { to: '/farmer/dashboard', labelKey: 'dashboard', fallback: 'Dashboard', icon: LayoutDashboard },
  { to: '/farmer/farms', labelKey: 'my_farms', fallback: 'My Farms', icon: Warehouse },
  { to: '/farmer/animals', labelKey: 'my_animals', fallback: 'My Animals', icon: Stethoscope },
  { to: '/farmer/log-treatment', labelKey: 'log_treatment', fallback: 'Log Treatment', icon: ClipboardList },
  { to: '/farmer/alerts', labelKey: 'alerts', fallback: 'Alerts', icon: Bell },
];

const vetLinks = [
  { to: '/vet/dashboard', labelKey: 'dashboard', fallback: 'Dashboard', icon: LayoutDashboard },
  { to: '/vet/farms', labelKey: 'assigned_farms', fallback: 'Assigned Farms', icon: Warehouse },
  { to: '/vet/prescribe', labelKey: 'issue_prescription', fallback: 'Prescribe', icon: ClipboardList },
];

const adminLinks = [
  { to: '/admin/dashboard', labelKey: 'dashboard', fallback: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/farms', labelKey: 'farm_risk_list', fallback: 'Farm Risk List', icon: Warehouse },
  { to: '/admin/analytics', labelKey: 'analytics', fallback: 'Analytics', icon: BarChart3 },
  { to: '/admin/resistance-map', labelKey: 'resistance_radar', fallback: 'Resistance Radar', icon: Map },
  { to: '/admin/audit-log', labelKey: 'audit_log', fallback: 'Audit Log', icon: Users },
];

const roleLinks = { farmer: farmerLinks, vet: vetLinks, admin: adminLinks };
const roleLabelKeys = { farmer: 'farmer_dashboard', vet: 'vet_dashboard', admin: 'admin_dashboard' };
const roleLabelFallbacks = { farmer: 'Farmer Portal', vet: 'Veterinarian Portal', admin: 'Govt. Official Portal' };

export default function Sidebar({ role, open, onClose }) {
  const { t } = useTranslation();
  const links = roleLinks[role] || [];
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:transform-none ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Brand header */}
        <div className="relative overflow-hidden">
          <div className="bg-farm-gradient px-4 py-5">
            <div className="absolute inset-0 farm-pattern opacity-30" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">FarmGuard</h1>
                  <p className="text-[10px] text-teal-100 font-medium uppercase tracking-wider">{t(roleLabelKeys[role] || roleLabelFallbacks[role]) || roleLabelFallbacks[role]}</p>
                </div>
              </div>
              <button onClick={onClose} className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 sidebar-active shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }>
              <link.icon size={18} />
              {t(link.labelKey) || link.fallback}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Sprout size={16} className="text-primary-600 dark:text-primary-400" />
              <p className="text-xs font-medium text-primary-700 dark:text-primary-400">Safe Farming</p>
            </div>
            <p className="text-[11px] text-primary-600/70 dark:text-primary-400/60 mt-1">
              Track treatments, ensure MRL compliance
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
