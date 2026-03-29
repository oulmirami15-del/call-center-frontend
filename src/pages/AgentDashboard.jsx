import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAgent } from '../context/AgentContext';
import { useSocket } from '../hooks/useSocket';
import { useTwilioDevice } from '../hooks/useTwilioDevice';
import PhoneWidget from '../components/PhoneWidget';
import StatusToggle from '../components/StatusToggle';
import CallLog from '../components/CallLog';
import AgentList from '../components/AgentList';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function AgentDashboard() {
  const { session, setSession } = useAgent();
  const navigate = useNavigate();

  const [agentStatus, setAgentStatus] = useState('online');
  const [calls, setCalls] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!session) navigate('/login');
  }, [session, navigate]);

  const agentId = session?.agent?.id;
  const token = session?.token;

  // Real-time presence over Socket.io
  const { presences, setOnline, setBusy, setOffline } = useSocket(agentId);

  // Twilio Voice SDK
  const { callState, callerNumber, acceptCall, rejectCall, hangupCall } = useTwilioDevice(token);

  // Auto-sync call state to presence
  useEffect(() => {
    if (callState === 'in-call') {
      setAgentStatus('busy');
      setBusy();
    } else if (callState === 'idle' && agentStatus === 'busy') {
      setAgentStatus('online');
      setOnline();
    }
  }, [callState]); // eslint-disable-line

  // Fetch call history every 30 seconds
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/calls/history`);
        setCalls(res.data);
      } catch (e) {
        console.warn('Could not fetch call history', e.message);
      }
    };
    fetchCalls();
    const interval = setInterval(fetchCalls, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (newStatus) => {
    setAgentStatus(newStatus);
    if (newStatus === 'online')  setOnline();
    if (newStatus === 'busy')    setBusy();
    if (newStatus === 'offline') setOffline();
  };

  const handleLogout = () => {
    setOffline();
    setSession(null);
    navigate('/login');
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* ─── Top Bar ─── */}
      <header className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-xl">📞</span>
            <span className="font-bold text-gray-800 text-lg">Call Center</span>
          </div>
          <span className="text-gray-400 hidden sm:block">|</span>
          <span className="text-gray-700 font-medium hidden sm:block">
            {session.agent.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <StatusToggle status={agentStatus} onChange={handleStatusChange} />
          {session.agent.role === 'admin' && (
            <button
              id="go-admin-btn"
              onClick={() => navigate('/admin')}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              LAARBI
            </button>
          )}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex gap-4 p-4 max-w-7xl mx-auto w-full">
        {/* Left: Agent List */}
        <AgentList presences={presences} currentAgentId={agentId} />

        {/* Center: Phone Widget */}
        <PhoneWidget
          callState={callState}
          callerNumber={callerNumber}
          onAccept={acceptCall}
          onReject={rejectCall}
          onHangup={hangupCall}
        />

        {/* Right: Call Log */}
        <div className="w-72 bg-white rounded-xl shadow p-4 flex-shrink-0 flex flex-col">
          <h2 className="font-semibold text-gray-600 text-sm uppercase tracking-wider mb-2 pb-2 border-b">
            Journal d'appels
          </h2>
          <CallLog calls={calls} />
        </div>
      </div>
    </div>
  );
}
