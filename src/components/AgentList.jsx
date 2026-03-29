import React from 'react';

const STATUS_DOT = {
  online:  'bg-green-500',
  busy:    'bg-yellow-400',
  offline: 'bg-gray-300',
};

const STATUS_LABEL = {
  online:  'Disponibile',
  busy:    'Occupato',
  offline: 'Offline',
};

const AGENT_NAMES = {
  agent1: 'Youssef',
  agent2: 'Karim',
  agent3: 'Sara',
  agent4: 'Admin',
};

export default function AgentList({ presences, currentAgentId }) {
  return (
    <div className="w-56 bg-white rounded-xl shadow p-4 flex-shrink-0">
      <h2 className="font-semibold text-gray-600 text-sm uppercase tracking-wider mb-4 pb-2 border-b">
        Agents
      </h2>
      <ul className="space-y-3">
        {Object.keys(presences).map((agentId) => {
          const status = presences[agentId] || 'offline';
          const isMe = agentId === currentAgentId;
          return (
            <li key={agentId} className={`flex items-center gap-3 ${isMe ? 'opacity-100' : 'opacity-80'}`}>
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`}></span>
              <div>
                <div className={`text-sm font-medium ${isMe ? 'text-blue-600' : 'text-gray-800'}`}>
                  {AGENT_NAMES[agentId] || agentId}
                  {isMe && <span className="ml-1 text-xs text-blue-400">(moi)</span>}
                </div>
                <div className="text-xs text-gray-400">{STATUS_LABEL[status]}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
