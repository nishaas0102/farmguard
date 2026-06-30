import * as BarCodeScanner from 'expo-barcode-scanner';
import { useState, useEffect } from 'react';

export const useQRScanner = () => {
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async (callback) => {
    return (scanningResult) => {
      setScanned(true);
      const { data } = scanningResult;
      callback(data);
    };
  };

  return { permission, scanned, setScanned, handleBarCodeScanned };
};
