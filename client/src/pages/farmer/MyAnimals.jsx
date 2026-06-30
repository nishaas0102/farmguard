import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { animalsAPI } from '../../api/animals';
import StatCard from '../../components/common/StatCard';
import QRScanner from '../../components/common/QRScanner';
import { PawPrint, Plus, ArrowRight, QrCode } from 'lucide-react';

const speciesEmoji = {
  cattle: '🐄',
  poultry: '🐔',
  goat: '🐐',
  sheep: '🐑',
  swine: '🐷',
  buffalo: '🐃',
};

export default function MyAnimals() {
  const { t } = useTranslation();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAnimals() {
      try {
        const { data } = await animalsAPI.getAll();
        setAnimals(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAnimals();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("my_animals")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your livestock health and treatment history</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowScanner(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <QrCode size={16} /> Scan QR
          </button>
          <Link to="/farmer/animals/new" className="inline-flex items-center gap-2 px-5 py-2.5 btn-teal text-white rounded-xl font-semibold text-sm">
            <Plus size={16} /> Add Animal
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Animals" value={animals.length} icon={PawPrint} color="primary" />
        <StatCard title="Cattle" value={animals.filter(a => a.species === 'cattle').length} color="green" />
        <StatCard title="Poultry" value={animals.filter(a => a.species === 'poultry').length} color="yellow" />
        <StatCard title="Other" value={animals.filter(a => !['cattle', 'poultry'].includes(a.species)).length} color="blue" />
      </div>

      {/* Animal List */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("all_animals")}</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-12">
              <PawPrint size={48} className="text-primary-300 dark:text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No animals found. Add one to start tracking treatments.</p>
              <Link to="/farmer/animals/new" className="inline-flex items-center gap-2 px-5 py-2.5 btn-teal text-white rounded-xl font-semibold text-sm">
                <Plus size={16} /> Add Your First Animal
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {animals.map((animal) => (
                <Link key={animal.id} to={`/farmer/animals/${animal.id}`} className="block p-5 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all card-hover group">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {speciesEmoji[animal.species] || '🐾'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 truncate">{animal.tag_number}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{animal.species}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{animal.weight_kg} kg</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={(tag) => {
            setShowScanner(false);
            const found = animals.find(a => a.tag_number === tag);
            if (found) navigate(`/farmer/animals/${found.id}`);
            else alert(`No animal found with tag: ${tag}`);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
