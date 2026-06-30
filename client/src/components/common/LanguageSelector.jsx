import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: '\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code: 'pa', name: 'Punjabi', native: '\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40' },
  { code: 'ta', name: 'Tamil', native: '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd' },
  { code: 'te', name: 'Telugu', native: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41' },
  { code: 'bn', name: 'Bengali', native: '\u09ac\u09be\u0982\u09b2\u09be' },
  { code: 'mr', name: 'Marathi', native: '\u092e\u0930\u093e\u0920\u0940' },
  { code: 'kn', name: 'Kannada', native: '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1' },
  { code: 'ml', name: 'Malayalam', native: '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02' },
  { code: 'gu', name: 'Gujarati', native: '\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0' },
  { code: 'or', name: 'Odia', native: '\u0b13\u0dc1\u0bbf\u0b06' },
];

export default function LanguageSelector({ variant = 'dropdown' }) {
  const { i18n } = useTranslation();

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('farmguard_lang', code);
  };

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              i18n.language === lang.code
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }`}
          >
            {lang.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none pl-8 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 cursor-pointer"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.native} ({lang.name})
          </option>
        ))}
      </select>
      <Globe size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}
