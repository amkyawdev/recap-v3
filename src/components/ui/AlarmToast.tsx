'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmMessage, AlarmType } from '@/types/subtitle';

interface AlarmContextType {
  addAlarm: (type: AlarmType, message: string, duration?: number) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within AlarmProvider');
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

  return (
    <AlarmContext.Provider value={{ addAlarm }}>
      {children}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {alarms.map((alarm) => (
            <AlarmToast key={alarm.id} alarm={alarm} />
          ))}
        </AnimatePresence>
      </div>
    </AlarmContext.Provider>
  );
}

function AlarmToast({ alarm }: { alarm: AlarmMessage }) {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`px-4 py-2 rounded-lg text-white shadow-lg ${bgColors[alarm.type]}`}
    >
      <span className="mr-2">{icons[alarm.type]}</span>
      {alarm.message}
    </motion.div>
  );
}