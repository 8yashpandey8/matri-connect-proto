import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Patient, Language } from '@/types';
import { samplePatients } from '@/lib/sampleData';
import { toast } from 'sonner';

interface AppContextType {
  user: User | null;
  language: Language;
  patients: Patient[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  setUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  syncData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Initialize data from localStorage or sample data
  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    const storedLanguage = localStorage.getItem('language');
    const storedUser = localStorage.getItem('user');
    const storedSyncTime = localStorage.getItem('lastSyncTime');

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      setPatients(samplePatients);
      localStorage.setItem('patients', JSON.stringify(samplePatients));
    }

    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedSyncTime) {
      setLastSyncTime(new Date(storedSyncTime));
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing data...');
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Data will be stored locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [patients]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem('patients', JSON.stringify(patients));
    }
  }, [patients]);

  useEffect(() => {
    if (language) {
      localStorage.setItem('language', language);
    }
  }, [language]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
    toast.success('Patient added successfully');
    if (isOnline) {
      syncData();
    }
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    toast.success('Patient updated successfully');
    if (isOnline) {
      syncData();
    }
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    toast.success('Patient deleted successfully');
    if (isOnline) {
      syncData();
    }
  };

  const syncData = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    
    // Simulate API sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSyncing(false);
    const now = new Date();
    setLastSyncTime(now);
    localStorage.setItem('lastSyncTime', now.toISOString());
    toast.success('Data synced successfully');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        language,
        patients,
        isOnline,
        isSyncing,
        lastSyncTime,
        setUser,
        setLanguage,
        addPatient,
        updatePatient,
        deletePatient,
        syncData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
