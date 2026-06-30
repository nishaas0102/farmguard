import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from '../../components/common/LanguageSelector';
import { Shield, Leaf, Syringe, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome, ${user.name}!`);
      switch (user.role) {
        case 'farmer': navigate('/farmer/dashboard'); break;
        case 'vet': navigate('/vet/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Farmer', email: 'harpreet@farmguard.demo', icon: '🧑‍🌾' },
    { role: 'Vet', email: 'amarjeet@farmguard.demo', icon: '👨‍⚕️' },
    { role: 'Govt. Official', email: 'admin@farmguard.demo', icon: '🛡️' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Farm Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-farm-hero relative overflow-hidden flex-col justify-between p-12">
        {/* Farm pattern overlay */}
        <div className="absolute inset-0 farm-pattern opacity-60" />

        {/* Decorative cow SVG */}
        <div className="absolute bottom-8 right-8 opacity-10">
          <svg width="320" height="280" viewBox="0 0 320 280" fill="none">
            <ellipse cx="160" cy="200" rx="120" ry="60" fill="white" opacity="0.1"/>
            <path d="M80 180c0-40 30-80 80-80s80 40 80 80" stroke="white" strokeWidth="3" fill="none"/>
            <circle cx="120" cy="140" r="8" fill="white"/>
            <circle cx="200" cy="140" r="8" fill="white"/>
            <ellipse cx="160" cy="165" rx="20" ry="12" fill="white" opacity="0.3"/>
            <path d="M100 120c-10-20-5-35 5-40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M220 120c10-20 5-35-5-40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <rect x="100" y="180" width="8" height="40" rx="4" fill="white" opacity="0.4"/>
            <rect x="140" y="180" width="8" height="40" rx="4" fill="white" opacity="0.4"/>
            <rect x="172" y="180" width="8" height="40" rx="4" fill="white" opacity="0.4"/>
            <rect x="212" y="180" width="8" height="40" rx="4" fill="white" opacity="0.4"/>
            {/* Tail */}
            <path d="M240 170c20-10 30 0 25 15" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Floating barn */}
        <div className="absolute top-20 right-16 animate-float opacity-15">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <path d="M10 50L60 15L110 50V95H10V50Z" fill="white"/>
            <rect x="45" y="60" width="30" height="35" rx="2" fill="white" opacity="0.3"/>
            <path d="M5 50L60 10L115 50" stroke="white" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* Floating leaves */}
        <div className="absolute top-40 left-12 animate-float-delayed opacity-20">
          <Leaf size={48} className="text-white" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float opacity-15">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 5C30 5 5 20 5 35C5 50 20 55 30 55C40 55 55 50 55 35C55 20 30 5 30 5Z" fill="white" opacity="0.3"/>
            <path d="M30 15V50" stroke="white" strokeWidth="1.5"/>
            <path d="M30 25C22 20 15 25 15 30" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M30 35C38 30 45 35 45 40" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">FarmGuard</h1>
          </div>
          <p className="text-teal-100 text-lg mt-3 max-w-md">
            Digital Farm Management Portal for Monitoring Antimicrobial Usage and Maximum Residue Limits in Livestock
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Syringe size={20} />
            </div>
            <div>
              <p className="font-medium">Track Antimicrobial Usage</p>
              <p className="text-sm text-teal-200">Log every treatment with withdrawal periods</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <p className="font-medium">Real-time Risk Assessment</p>
              <p className="text-sm text-teal-200">Farm risk scores updated automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Leaf size={20} />
            </div>
            <div>
              <p className="font-medium">MRL Compliance</p>
              <p className="text-sm text-teal-200">Ensure food safety and regulatory compliance</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-teal-200 text-sm">
          <p>Protecting livestock health across India</p>
          <p className="text-teal-300/60 text-xs mt-1">Punjab, Haryana, Rajasthan, Gujarat & more</p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-farm-gradient rounded-2xl flex items-center justify-center">
                <Shield size={22} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gradient">FarmGuard</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Antimicrobial Usage Monitoring</p>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('welcome')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('sign_in_continue')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-primary-900/5 border border-gray-100 dark:border-gray-700/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('email')}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('password')}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 px-4 btn-teal text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Signing in...
                  </span>
                ) : t('sign_in')}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('no_account')}{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">{t('create_one')}</Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-primary-900/5 border border-gray-100 dark:border-gray-700/50 p-6 animate-slide-up-delay-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                <span className="text-xs">🧪</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('demo_accounts')}</h3>
            </div>
            <div className="space-y-2">
              {demoAccounts.map(a => (
                <button key={a.email} onClick={() => { setEmail(a.email); setPassword('Feb@2008'); }}
                  className="w-full text-left px-4 py-3 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{a.role}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{a.email}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Feb@2008</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
