import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OfflineIndicator() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) setShowBanner(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg transition-all ${
      isOnline ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'
    }`}>
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span className="text-sm font-medium">{t('synced')} - Back online</span>
          <RefreshCw size={14} className="animate-spin" />
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span className="text-sm font-medium">{t('no_internet')} - {t('offline_mode')}</span>
        </>
      )}
    </div>
  );
}
