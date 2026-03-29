import React, { useState, useRef } from 'react';

export default function VoicemailPlayer({ url, callerNumber, timestamp }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString('fr-FR');
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-blue-50 flex items-center gap-4">
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center flex-shrink-0 transition"
        title={playing ? 'Pause' : 'Lire'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">{callerNumber || 'Numéro inconnu'}</div>
        <div className="text-xs text-gray-500">{formatDate(timestamp)}</div>
        <audio
          ref={audioRef}
          src={url}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      </div>
      {url && (
        <a
          href={url}
          download
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          title="Télécharger"
        >
          ⬇
        </a>
      )}
    </div>
  );
}
