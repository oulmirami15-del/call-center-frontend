import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAgent } from '../context/AgentContext';
import CallLog from '../components/CallLog';
import VoicemailPlayer from '../components/VoicemailPlayer';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function AdminPanel() {
  const { session, setSession } = useAgent();
  const navigate = useNavigate();
  const [calls, setCalls] = useState([]);
  const [stats, setStats] = useState({ today: 0, missed: 0, total: 0 });

  if (!session || session.agent.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callRes, statsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/calls/history`),
          axios.get(`${backendUrl}/api/calls/stats`),
        ]);
        setCalls(callRes.data);
        setStats(statsRes.data);
      } catch (e) {
        console.warn('Admin fetch error:', e.message);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const voicemails = calls.filter(c => c.status === 'voicemail' && c.voicemail_url);

  const handleLogout = () => {
    setSession(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 text-2xl">📊</span>
          <h1 className="text-xl font-bold text-gray-800">Panneau d'Administration</h1>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Dashboard Agent
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Appels aujourd'hui" value={stats.today} color="blue" icon="📞" />
          <StatCard label="Appels manqués" value={stats.missed} color="red" icon="❌" />
          <StatCard label="Total des appels" value={stats.total} color="green" icon="📈" />
        </div>

        {/* Call Log Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-700 text-lg mb-4 pb-2 border-b">Journal des appels</h2>
          {calls.length === 0 ? (
            <p className="text-gray-400 italic text-sm">Aucun appel enregistré pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3">Numéro</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Durée</th>
                    <th className="px-4 py-3">Agent</th>
                    <th className="px-4 py-3">Date & Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call, i) => (
                    <tr key={call.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 font-mono">{call.caller_number || '–'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={call.status} />
                      </td>
                      <td className="px-4 py-3">{call.duration ? `${call.duration}s` : '–'}</td>
                      <td className="px-4 py-3">{call.agent_id || '–'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {call.timestamp ? new Date(call.timestamp).toLocaleString('fr-FR') : '–'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Voicemails Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-700 text-lg mb-4 pb-2 border-b">
            Messageries vocales
            {voicemails.length > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {voicemails.length}
              </span>
            )}
          </h2>
          {voicemails.length === 0 ? (
            <p className="text-gray-400 italic text-sm">Aucun message vocal pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {voicemails.map((vm) => (
                <VoicemailPlayer
                  key={vm.id}
                  url={vm.voicemail_url}
                  callerNumber={vm.caller_number}
                  timestamp={vm.timestamp}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    blue:  'bg-blue-50 border-blue-100 text-blue-700',
    red:   'bg-red-50 border-red-100 text-red-700',
    green: 'bg-green-50 border-green-100 text-green-700',
  };
  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 ${colors[color]}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm opacity-80">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    answered:  'bg-green-100 text-green-700',
    missed:    'bg-red-100 text-red-700',
    voicemail: 'bg-blue-100 text-blue-700',
    incoming:  'bg-yellow-100 text-yellow-700',
  };
  const labels = {
    answered: 'Répondu', missed: 'Manqué', voicemail: 'Messagerie', incoming: 'En cours',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}
