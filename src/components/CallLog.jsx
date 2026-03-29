import React from 'react';

const STATUS_COLORS = {
  answered:  'text-green-600 bg-green-50',
  missed:    'text-red-600 bg-red-50',
  voicemail: 'text-blue-600 bg-blue-50',
  incoming:  'text-yellow-600 bg-yellow-50',
};

const STATUS_LABELS = {
  answered:  'Répondu',
  missed:    'Manqué',
  voicemail: 'Messagerie',
  incoming:  'En cours',
};

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '–';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function CallLog({ calls = [] }) {
  if (calls.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic mt-4 text-center">
        Aucun appel pour le moment.
      </div>
    );
  }

  return (
    <ul className="space-y-2 mt-2 overflow-y-auto max-h-[calc(100vh-240px)]">
      {calls.map((call) => (
        <li key={call.id} className="border rounded-lg p-3 bg-gray-50 text-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono font-semibold text-gray-800">
              {call.caller_number || 'Inconnu'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[call.status] || 'text-gray-500 bg-gray-100'}`}>
              {STATUS_LABELS[call.status] || call.status}
            </span>
          </div>
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Durée: {formatDuration(call.duration)}</span>
            <span>{formatTime(call.timestamp)}</span>
          </div>
          {call.agent_id && (
            <div className="text-xs text-gray-400 mt-0.5">Agent: {call.agent_id}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
