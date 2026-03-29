import React, { createContext, useContext, useState } from 'react';

const AgentContext = createContext(null);

/**
 * session shape:
 * {
 *   token: string,         // Twilio Access Token JWT
 *   agent: {
 *     id: string,
 *     name: string,
 *     role: 'agent' | 'admin'
 *   }
 * }
 */
export function AgentProvider({ children }) {
  const [session, setSession] = useState(() => {
    // Persist session across page refresh (agents reloading the tab)
    try {
      const saved = sessionStorage.getItem('cc_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveSession = (data) => {
    setSession(data);
    if (data) {
      sessionStorage.setItem('cc_session', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('cc_session');
    }
  };

  return (
    <AgentContext.Provider value={{ session, setSession: saveSession }}>
      {children}
    </AgentContext.Provider>
  );
}

export const useAgent = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used inside <AgentProvider>');
  return ctx;
};
