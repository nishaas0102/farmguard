import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import App from './App';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
