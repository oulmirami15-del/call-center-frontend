import React, { useEffect, useState } from 'react';

/**
 * PhoneWidget — pure presentational component.
 * All call state is managed by useTwilioDevice in AgentDashboard
 * and passed down as props.
 */
export default function PhoneWidget({ callState = 'idle', callerNumber = '', onAccept, onReject, onHangup }) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer;
    if (callState === 'in-call') {
      setDuration(0);
      timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow flex items-center justify-center flex-col transition-all duration-300 min-h-[300px] p-8">

      {/* ── IDLE ── */}
      {callState === 'idle' && (
        <div className="text-center select-none">
          <div className="text-7xl mb-5 text-gray-300">📞</div>
          <h2 className="text-2xl font-semibold text-gray-500 mb-2">En attente d'appel…</h2>
          <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
            Le terminal s'activera automatiquement à la réception d'un appel entrant.
            Assurez-vous que votre statut est <span className="text-green-600 font-medium">Disponibile</span>.
          </p>
        </div>
      )}

      {/* ── INCOMING ── */}
      {callState === 'incoming' && (
        <div className="text-center">
          {/* Pulsing ring animation */}
          <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-30 animate-ping"></span>
            <span className="absolute inline-flex h-3/4 w-3/4 rounded-full bg-yellow-400 opacity-40 animate-ping" style={{ animationDelay: '0.3s' }}></span>
            <div className="relative w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl shadow-lg">
              📱
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Appel entrant !</h2>
          <p className="text-xl font-mono text-gray-600 mb-8 tracking-wide">
            {callerNumber || 'Numéro masqué'}
          </p>

          <div className="flex gap-6 justify-center">
            <CallButton
              id="accept-call-btn"
              onClick={onAccept}
              color="green"
              icon="✅"
              label="Accepter"
            />
            <CallButton
              id="reject-call-btn"
              onClick={onReject}
              color="red"
              icon="❌"
              label="Refuser"
            />
          </div>
        </div>
      )}

      {/* ── IN CALL ── */}
      {callState === 'in-call' && (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center relative">
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></span>
            <span className="text-4xl">🎙️</span>
          </div>

          <h2 className="text-lg font-semibold text-gray-600 mb-1">En communication</h2>
          <p className="text-2xl font-mono text-gray-800 mb-2 tracking-wide">
            {callerNumber || 'Numéro inconnu'}
          </p>
          <div className="text-4xl font-mono tabular-nums text-green-600 mb-8">
            {formatDuration(duration)}
          </div>

          <CallButton
            id="hangup-btn"
            onClick={onHangup}
            color="red"
            icon="📴"
            label="Raccrocher"
          />
        </div>
      )}
    </div>
  );
}

function CallButton({ id, onClick, color, icon, label }) {
  const base = 'flex items-center gap-2 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition text-white';
  const colors = {
    green: 'bg-green-500 hover:bg-green-600',
    red:   'bg-red-500 hover:bg-red-600',
  };
  return (
    <button id={id} onClick={onClick} className={`${base} ${colors[color]}`}>
      <span>{icon}</span> {label}
    </button>
  );
}
