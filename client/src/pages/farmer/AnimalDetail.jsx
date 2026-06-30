import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { animalsAPI } from '../../api/animals';
import { amuAPI } from '../../api/amu';
import RiskBadge from '../../components/common/RiskBadge';
import CountdownTimer from '../../components/common/CountdownTimer';
import WithdrawalCountdown from '../../components/common/WithdrawalCountdown';
import QRCodeAnimal from '../../components/common/QRCodeAnimal';
import { formatDateTime, formatDuration } from '../../utils/dateHelpers';
import { ArrowLeft, Syringe, Calendar, User, FileText, QrCode } from 'lucide-react';

const speciesEmoji = { cattle: '🐄', poultry: '🐔', goat: '🐐', sheep: '🐑', swine: '🐷', buffalo: '🐃' };

export default function AnimalDetail() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnimal() {
      try {
        const [animalRes, historyRes] = await Promise.all([
          animalsAPI.getOne(id),
          amuAPI.getAll({ animal_id: id }),
        ]);
        setAnimal(animalRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAnimal();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!animal) return <div className="text-center py-20 text-gray-500">Animal not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/farmer/animals" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">{speciesEmoji[animal.species] || '🐾'}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{animal.tag_number}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{animal.species} • {animal.weight_kg} kg</p>
          </div>
        </div>
        <RiskBadge level={animal.risk_level ?? 'green'} />
      </div>

      {/* Info + QR Code */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Farm</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-white">{animal.farm?.name || 'Unknown'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Registered</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-white">{formatDateTime(animal.createdAt)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-2">
            <QrCode size={14} />
            <span className="text-xs uppercase tracking-wide">QR Code</span>
          </div>
          <QRCodeAnimal animal={animal} farm={animal.farm} />
        </div>
      </div>

      {/* Withdrawal Countdown */}
      {history.length > 0 && history.some(h => h.safe_sale_date && new Date(h.safe_sale_date) > new Date()) && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Withdrawal Periods</h3>
          {history.filter(h => h.safe_sale_date && new Date(h.safe_sale_date) > new Date()).map(h => (
            <WithdrawalCountdown key={h.id} safeSaleDate={h.safe_sale_date} productName={`${h.drug?.name || 'Drug'} (${animal.tag_number})`} />
          ))}
        </div>
      )}

      {/* Treatment History */}
      <section className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Treatment History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">All treatments and withdrawal countdowns</p>
          </div>
          <Link to="/farmer/log-treatment" className="inline-flex items-center gap-1.5 px-4 py-2 btn-teal text-white rounded-xl text-sm font-semibold">
            <Syringe size={14} /> Log Treatment
          </Link>
        </div>
        <div className="p-6">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Syringe size={40} className="text-primary-300 dark:text-primary-600 mx-auto mb-3" />
              <p className="text-gray-500">No treatments logged yet for this animal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-gray-50/50 dark:bg-gray-900/50 p-5 border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-700/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{entry.drug?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{entry.dosage} {entry.dosage_unit} • {entry.frequency} • {formatDuration(entry.duration_days)}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(entry.treatment_start_date)}</span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                        <Calendar size={12} />
                        <span className="text-xs uppercase tracking-wide">Withdrawal Safe Sale</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.safe_sale_date ? formatDateTime(entry.safe_sale_date) : 'N/A'}</p>
                      {entry.safe_sale_date && <CountdownTimer date={entry.safe_sale_date} />}
                    </div>
                    <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                        <User size={12} />
                        <span className="text-xs uppercase tracking-wide">Vet</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.vet?.name || 'Not provided'}</p>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                      <FileText size={14} className="mt-0.5 text-gray-400 shrink-0" />
                      <span>{entry.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
