import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyFarms from './pages/farmer/MyFarms';
import NewFarm from './pages/farmer/NewFarm';
import FarmDetail from './pages/farmer/FarmDetail';
import MyAnimals from './pages/farmer/MyAnimals';
import NewAnimal from './pages/farmer/NewAnimal';
import AnimalDetail from './pages/farmer/AnimalDetail';
import LogTreatment from './pages/farmer/LogTreatment';
import MyAlerts from './pages/farmer/MyAlerts';
import VetDashboard from './pages/vet/VetDashboard';
import AssignedFarms from './pages/vet/AssignedFarms';
import IssuePrescription from './pages/vet/IssuePrescription';
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmRiskList from './pages/admin/FarmRiskList';
import FarmDrilldown from './pages/admin/FarmDrilldown';
import Analytics from './pages/admin/Analytics';
import ResistanceMap from './pages/admin/ResistanceMap';
import AuditLog from './pages/admin/AuditLog';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><p className="text-gray-500">Loading...</p></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'farmer': return <Navigate to="/farmer/dashboard" />;
    case 'vet': return <Navigate to="/vet/dashboard" />;
    case 'admin': return <Navigate to="/admin/dashboard" />;
    default: return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Farmer — Phase 11 */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/farms" element={<ProtectedRoute roles={['farmer']}><MyFarms /></ProtectedRoute>} />
      <Route path="/farmer/farms/new" element={<ProtectedRoute roles={['farmer']}><NewFarm /></ProtectedRoute>} />
      <Route path="/farmer/farms/:id" element={<ProtectedRoute roles={['farmer']}><FarmDetail /></ProtectedRoute>} />
      <Route path="/farmer/animals" element={<ProtectedRoute roles={['farmer']}><MyAnimals /></ProtectedRoute>} />
      <Route path="/farmer/animals/new" element={<ProtectedRoute roles={['farmer']}><NewAnimal /></ProtectedRoute>} />
      <Route path="/farmer/animals/:id" element={<ProtectedRoute roles={['farmer']}><AnimalDetail /></ProtectedRoute>} />
      <Route path="/farmer/log-treatment" element={<ProtectedRoute roles={['farmer']}><LogTreatment /></ProtectedRoute>} />
      <Route path="/farmer/alerts" element={<ProtectedRoute roles={['farmer']}><MyAlerts /></ProtectedRoute>} />

      {/* Vet — Phase 12 */}
      <Route path="/vet/dashboard" element={<ProtectedRoute roles={['vet']}><VetDashboard /></ProtectedRoute>} />
      <Route path="/vet/farms" element={<ProtectedRoute roles={['vet']}><AssignedFarms /></ProtectedRoute>} />
      <Route path="/vet/prescribe" element={<ProtectedRoute roles={['vet']}><IssuePrescription /></ProtectedRoute>} />

      {/* Admin — Phase 13 */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/farms" element={<ProtectedRoute roles={['admin']}><FarmRiskList /></ProtectedRoute>} />
      <Route path="/admin/farms/:id" element={<ProtectedRoute roles={['admin']}><FarmDrilldown /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><Analytics /></ProtectedRoute>} />
      <Route path="/admin/resistance-map" element={<ProtectedRoute roles={['admin']}><ResistanceMap /></ProtectedRoute>} />
      <Route path="/admin/audit-log" element={<ProtectedRoute roles={['admin']}><AuditLog /></ProtectedRoute>} />
    </Routes>
  );
}
