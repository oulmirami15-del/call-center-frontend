import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Connects to the backend Socket.io server, registers the agent,
 * and keeps the presence map in sync in real time.
 */
export function useSocket(agentId) {
  const socketRef = useRef(null);
  const [presences, setPresences] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!agentId) return;

    const socket = io(backendUrl, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('register', agentId);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('presence:update', (data) => {
      setPresences(data);
    });

    return () => {
      socket.emit('agent:offline', agentId);
      socket.disconnect();
    };
  }, [agentId]);

  const setOnline  = () => socketRef.current?.emit('agent:online',  agentId);
  const setBusy    = () => socketRef.current?.emit('agent:busy',    agentId);
  const setOffline = () => socketRef.current?.emit('agent:offline', agentId);

  return { presences, connected, setOnline, setBusy, setOffline };
}
