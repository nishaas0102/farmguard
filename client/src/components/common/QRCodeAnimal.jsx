import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import { Download, Printer } from 'lucide-react';

export default function QRCodeAnimal({ animal, farm }) {
  const qrRef = useRef(null);

  const qrData = JSON.stringify({
    type: 'farmguard_animal',
    tag: animal?.tag_number,
    species: animal?.species,
    breed: animal?.breed,
    farm: farm?.name,
    url: `${window.location.origin}/farmer/animals/${animal?.id}`,
  });

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      const link = document.createElement('a');
      link.download = `QR_${animal?.tag_number}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>QR - ${animal?.tag_number}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}
      h2{margin-bottom:8px;}p{margin:4px 0;font-size:14px;color:#666;}</style></head>
      <body>
        <h2>${animal?.tag_number} - ${animal?.species}</h2>
        <img src="data:image/svg+xml;base64,${btoa(svgData)}" width="300" height="300" />
        <p><strong>${farm?.name || ''}</strong></p>
        <p>${animal?.breed || ''} | ${animal?.weight_kg || ''} kg</p>
        <p>Scan to view treatment history</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <div ref={qrRef} className="p-3 bg-white rounded-xl shadow-sm">
        <QRCodeSVG
          value={qrData}
          size={200}
          level="H"
          includeMargin
          bgColor="#ffffff"
          fgColor="#0f766e"
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-900 dark:text-white">{animal?.tag_number}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{animal?.species} - {animal?.breed}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
          <Download size={14} /> Download
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <Printer size={14} /> Print
        </button>
      </div>
    </div>
  );
}
