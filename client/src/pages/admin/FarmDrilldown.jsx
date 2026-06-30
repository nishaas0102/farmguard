import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { farmsAPI } from '../../api/farms';
import { amuAPI } from '../../api/amu';
import RiskBadge from '../../components/common/RiskBadge';
import { formatDateTime } from '../../utils/dateHelpers';

export default function FarmDrilldown() {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmData() {
      try {
        const [farmRes, treatmentsRes] = await Promise.all([
          farmsAPI.getOne(id),
          amuAPI.getAll({ farm_id: id }),
        ]);

        setFarm(farmRes.data);
        setTreatments(treatmentsRes.data.sort((a, b) => new Date(b.treatment_start_date) - new Date(a.treatment_start_date)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadFarmData();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading farm data...</div>;
  if (!farm) return <div className="text-center py-12">Farm not found.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{farm.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{farm.district}, {farm.state}</p>
          </div>
          <RiskBadge level={farm.risk_score >= 70 ? 'red' : farm.risk_score >= 31 ? 'yellow' : 'green'} score={farm.risk_score} />
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Owner</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{farm.owner?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Area</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{farm.area_acres} acres</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{farm.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Treatments</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{treatments.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Treatment History</h2>

        {treatments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No treatments recorded for this farm.</p>
        ) : (
          <div className="space-y-4">
            {treatments.map((log) => (
              <div key={log.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <div className="grid gap-4 lg:grid-cols-5">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Animal</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{log.animal?.tag_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Drug</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{log.drug?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Dosage</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{log.dosage} {log.dosage_unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Vet</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{log.loggedBy?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatDateTime(log.treatment_start_date)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Frequency</p>
                    <p className="text-gray-900 dark:text-white">{log.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="text-gray-900 dark:text-white">{log.duration_days} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Safe to Sell</p>
                    <p className="text-gray-900 dark:text-white">{formatDateTime(log.safe_sale_date)}</p>
                  </div>
                </div>
                {log.notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Notes: {log.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
