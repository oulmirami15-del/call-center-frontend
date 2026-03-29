import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAgent } from '../context/AgentContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function Login() {
  const [id, setId] = useState('agent1');
  const [password, setPassword] = useState('pass1');
  const [error, setError] = useState('');
  const { setSession } = useAgent();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/agents/login`, { id, password });
      setSession(res.data);
      if (res.data.agent.role === 'admin') {
         navigate('/admin');
      } else {
         navigate('/dashboard');
      }
    } catch (err) {
      setError('Identifiants invalides');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Connexion Agent</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">ID Agent</label>
            <input type="text" value={id} onChange={e => setId(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
