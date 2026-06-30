import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer', phone: '', district: '', state: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name}`);
      switch (user.role) {
        case 'farmer': navigate('/farmer/dashboard'); break;
        case 'vet': navigate('/vet/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Farm Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-farm-hero relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 farm-pattern opacity-60" />

        {/* Decorative animals */}
        <div className="absolute bottom-8 right-8 opacity-10">
          <svg width="280" height="240" viewBox="0 0 280 240" fill="none">
            {/* Cow */}
            <ellipse cx="140" cy="170" rx="100" ry="50" fill="white" opacity="0.1"/>
            <path d="M70 150c0-35 25-70 70-70s70 35 70 70" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="105" cy="115" r="7" fill="white"/>
            <circle cx="175" cy="115" r="7" fill="white"/>
            <ellipse cx="140" cy="138" rx="18" ry="10" fill="white" opacity="0.3"/>
            <path d="M85 95c-8-18-4-30 4-34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M195 95c8-18 4-30-4-34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="88" y="150" width="7" height="35" rx="3" fill="white" opacity="0.4"/>
            <rect x="123" y="150" width="7" height="35" rx="3" fill="white" opacity="0.4"/>
            <rect x="150" y="150" width="7" height="35" rx="3" fill="white" opacity="0.4"/>
            <rect x="185" y="150" width="7" height="35" rx="3" fill="white" opacity="0.4"/>
            <path d="M210 140c18-8 26 0 22 12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="absolute top-20 right-16 animate-float opacity-15">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <path d="M10 50L60 15L110 50V95H10V50Z" fill="white"/>
            <rect x="45" y="60" width="30" height="35" rx="2" fill="white" opacity="0.3"/>
            <path d="M5 50L60 10L115 50" stroke="white" strokeWidth="3" fill="none"/>
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
            Join thousands of farmers and veterinarians protecting livestock health across India
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-3xl font-bold text-white">50+</p>
            <p className="text-teal-200 text-sm">Drugs tracked</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-teal-200 text-sm">Animal species</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-3xl font-bold text-white">24/7</p>
            <p className="text-teal-200 text-sm">Risk monitoring</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-3xl font-bold text-white">100%</p>
            <p className="text-teal-200 text-sm">MRL compliance</p>
          </div>
        </div>

        <div className="relative z-10 text-teal-200 text-sm">
          <p>Trusted by farmers across Punjab, Haryana & Rajasthan</p>
        </div>
      </div>

      {/* Right Panel — Register Form */}
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
            <p className="text-gray-500 dark:text-gray-400">Create your account</p>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Start monitoring your farm's health today</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-primary-900/5 border border-gray-100 dark:border-gray-700/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                  <option value="farmer">Farmer</option>
                  <option value="vet">Veterinarian</option>
                  <option value="admin">Government Official</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">District</label>
                  <input type="text" name="district" value={form.district} onChange={handleChange} placeholder="Your district"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State</label>
                <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="Your state"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 px-4 btn-teal text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
