import { useState, useEffect, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';

export function useTwilioDevice(token) {
  const [device, setDevice] = useState(null);
  const [callState, setCallState] = useState('idle'); // 'idle', 'incoming', 'in-call'
  const [call, setCall] = useState(null);
  const [callerNumber, setCallerNumber] = useState('');
  
  const callRef = useRef(null); // Keep a ref to the active Call object

  useEffect(() => {
    if (!token) return;

    let localDevice;
    try {
      localDevice = new Device(token, {
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true
      });
      
      localDevice.register();
      setDevice(localDevice);

      localDevice.on('registered', () => {
        console.log('Twilio Device Registered');
      });

      localDevice.on('error', (twilioError) => {
        console.error('Twilio Error:', twilioError);
      });

      localDevice.on('incoming', (incomingCall) => {
        console.log('Incoming call from', incomingCall.parameters.From);
        setCallState('incoming');
        setCall(incomingCall);
        callRef.current = incomingCall;
        setCallerNumber(incomingCall.parameters.From);

        incomingCall.on('accept', () => {
          setCallState('in-call');
        });

        incomingCall.on('disconnect', () => {
          setCallState('idle');
          setCall(null);
          callRef.current = null;
        });

        incomingCall.on('cancel', () => {
          setCallState('idle');
          setCall(null);
          callRef.current = null;
        });
        
        incomingCall.on('reject', () => {
          setCallState('idle');
          setCall(null);
          callRef.current = null;
        });
      });

    } catch (e) {
      console.error('Failed to initialize device:', e);
    }

    return () => {
      if (localDevice) {
        localDevice.destroy();
      }
    };
  }, [token]);

  const acceptCall = () => {
    if (callRef.current) {
      callRef.current.accept();
    }
  };

  const rejectCall = () => {
    if (callRef.current) {
      callRef.current.reject();
    }
  };

  const hangupCall = () => {
    if (callRef.current) {
      callRef.current.disconnect();
    }
  };

  return { device, callState, call, callerNumber, acceptCall, rejectCall, hangupCall };
}
