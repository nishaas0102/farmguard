import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function WithdrawalCountdown({ safeSaleDate, productName = 'Product' }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!safeSaleDate) return;

    const calculate = () => {
      const now = new Date();
      const saleDate = new Date(safeSaleDate);
      const diff = saleDate - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }

      setIsExpired(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft({ days, hours });
    };

    calculate();
    const interval = setInterval(calculate, 60 * 60 * 1000); // Update hourly
    return () => clearInterval(interval);
  }, [safeSaleDate]);

  if (!safeSaleDate) return null;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
        <div>
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">SAFE FOR SALE</p>
          <p className="text-xs text-green-600 dark:text-green-400">{productName} withdrawal period complete</p>
        </div>
      </div>
    );
  }

  const urgency = timeLeft?.days <= 1 ? 'red' : timeLeft?.days <= 3 ? 'amber' : 'blue';
  const colors = {
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 border rounded-xl ${colors[urgency]}`}>
      {urgency === 'red' ? (
        <AlertTriangle size={18} />
      ) : (
        <Clock size={18} />
      )}
      <div>
        <p className="text-sm font-semibold">
          {timeLeft?.days > 0 ? `${timeLeft.days}d ${timeLeft.hours}h remaining` : `${timeLeft?.hours}h remaining`}
        </p>
        <p className="text-xs opacity-80">Withdrawal active - Do NOT sell {productName.toLowerCase()}</p>
      </div>
    </div>
  );
}
