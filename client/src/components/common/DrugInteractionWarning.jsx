import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  dangerous: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    icon: ShieldAlert,
    label: 'DANGEROUS',
  },
  caution: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    icon: AlertTriangle,
    label: 'CAUTION',
  },
  safe: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    icon: Info,
    label: 'SAFE',
  },
};

export default function DrugInteractionWarning({ interactions }) {
  if (!interactions || interactions.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <Info size={16} className="text-green-600 dark:text-green-400" />
        <p className="text-sm text-green-700 dark:text-green-300">No known interactions detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {interactions.map((interaction, idx) => {
        const config = SEVERITY_CONFIG[interaction.severity] || SEVERITY_CONFIG.caution;
        const Icon = config.icon;
        return (
          <div key={idx} className={`flex items-start gap-3 px-4 py-3 ${config.bg} border ${config.border} rounded-xl`}>
            <Icon size={20} className={config.text} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold ${config.text} uppercase`}>{config.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {interaction.drugs.join(' + ')}
                </span>
              </div>
              <p className={`text-sm font-medium ${config.text}`}>{interaction.effect}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{interaction.recommendation}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
