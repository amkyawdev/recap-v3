'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AlarmMessage, AlarmType } from '@/types/subtitle';

interface AlarmContextType {
  alarms: AlarmMessage[];
  addAlarm: (type: AlarmType, message: string, duration?: number) => void;
  removeAlarm: (id: string) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);
const AlarmContextProvider = AlarmContext.Provider;

export function useAlarmContext() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarmContext must be used within AlarmProvider');
  }
  return context;
}

interface AlarmProviderProps {
  children: ReactNode;
}

export function AlarmProvider({ children }: AlarmProviderProps) {
  const [alarms, setAlarms] = useState<AlarmMessage[]>([]);

  const addAlarm = useCallback((type: AlarmType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    setAlarms((prev) => [...prev, { id, type, message, duration }]);

    setTimeout(() => {
      setAlarms((prev) => prev.filter((a) => a.id !== id));
    }, duration);
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlarmContextProvider value={{ alarms, addAlarm, removeAlarm }}>
      {children}
    </AlarmContextProvider>
  );
}