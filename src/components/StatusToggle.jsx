import React from 'react';

/**
 * Three-state toggle: Disponibile (online) | Occupato (busy) | Offline
 * Labels are Italian since they map to what the caller sees.
 */
const STATES = [
  { key: 'online', label: 'Disponibile', dotClass: 'bg-green-500',  textClass: 'text-green-700',  ringClass: 'ring-green-300' },
  { key: 'busy',   label: 'Occupato',    dotClass: 'bg-yellow-400', textClass: 'text-yellow-700', ringClass: 'ring-yellow-300' },
  { key: 'offline',label: 'Offline',     dotClass: 'bg-gray-400',   textClass: 'text-gray-600',   ringClass: 'ring-gray-300' },
];

export default function StatusToggle({ status, onChange }) {
  return (
    <div className="flex rounded-full border border-gray-200 shadow-sm overflow-hidden bg-gray-50">
      {STATES.map(({ key, label, dotClass, textClass }) => (
        <button
          key={key}
          id={`status-${key}`}
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200
            ${status === key
              ? `bg-white shadow-inner ${textClass} font-semibold`
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`}></span>
          {label}
        </button>
      ))}
    </div>
  );
}
