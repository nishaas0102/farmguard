import { Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useTranslation } from 'react-i18next';

export default function VoiceInputButton({ onResult, lang }) {
  const { t } = useTranslation();
  const { isListening, transcript, error, isSupported, startListening, stopListening, resetTranscript } = useVoiceInput(lang);

  const handleClick = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onResult(transcript);
        resetTranscript();
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={`p-2.5 rounded-xl transition-all ${
          isListening
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
            : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'
        }`}
        title={isListening ? t('listening') : t('voice_input')}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      {isListening && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
          {t('speak_now')}
        </span>
      )}
      {error && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap max-w-[200px] truncate">
          {error}
        </span>
      )}
    </div>
  );
}
