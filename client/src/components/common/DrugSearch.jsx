import { useState, useEffect, useRef } from 'react';
import { drugsAPI } from '../../api/drugs';

export default function DrugSearch({ onSelect, value }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (value) setQuery(value.name || value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const { data } = await drugsAPI.getAll({ search: query });
          setResults(data);
          setOpen(true);
        } catch { setResults([]); }
      } else {
        setResults([]);
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <input
        type="text" value={query}
        onChange={e => { setQuery(e.target.value); if (!e.target.value) onSelect(null); }}
        placeholder="Search drugs..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
      />
      {open && results.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map(drug => (
            <button key={drug.id} type="button"
              onClick={() => { onSelect(drug); setQuery(drug.name); setOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="font-medium text-gray-900 dark:text-white">{drug.name}</span>
              <span className="text-xs text-gray-500 ml-2">{drug.drug_class} — {drug.who_category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
