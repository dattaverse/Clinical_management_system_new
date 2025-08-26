import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Clinic } from '../types';

interface ClinicContextType {
  selectedClinic: string | null;
  setSelectedClinic: (clinicId: string | null) => void;
  clinics: Clinic[];
  loading: boolean;
  refreshClinics: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const useClinicContext = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinicContext must be used within a ClinicProvider');
  }
  return context;
};

interface ClinicProviderProps {
  children: ReactNode;
}

export const ClinicProvider: React.FC<ClinicProviderProps> = ({ children }) => {
  const [selectedClinic, setSelectedClinic] = useState<string | null>('all');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const { doctor, isAdmin } = useAuth();

  const fetchClinics = async () => {
    if (isAdmin || !doctor) {
      setLoading(false);
      return;
    }

    try {
      if (!isSupabaseConfigured) {
        // Demo data - ensure consistency with database schema
        const demoClinics: Clinic[] = [
          {
            id: '1',
            doctor_id: doctor.id,
            name: 'Main Medical Center',
            address: '123 Health St',
            city: 'New York',
            state: 'NY',
            country: 'US',
            phone: '+1 (555) 123-4567',
            hours_json: {
              monday: { open: '09:00', close: '17:00' },
              tuesday: { open: '09:00', close: '17:00' },
              wednesday: { open: '09:00', close: '17:00' },
              thursday: { open: '09:00', close: '17:00' },
              friday: { open: '09:00', close: '17:00' },
              saturday: { open: '09:00', close: '13:00' },
              sunday: { open: 'closed', close: 'closed' }
            },
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            doctor_id: doctor.id,
            name: 'Downtown Clinic',
            address: '456 Medical Ave',
            city: 'New York',
            state: 'NY',
            country: 'US',
            phone: '+1 (555) 987-6543',
            hours_json: {
              monday: { open: '08:00', close: '18:00' },
              tuesday: { open: '08:00', close: '18:00' },
              wednesday: { open: '08:00', close: '18:00' },
              thursday: { open: '08:00', close: '18:00' },
              friday: { open: '08:00', close: '16:00' },
              saturday: { open: 'closed', close: 'closed' },
              sunday: { open: 'closed', close: 'closed' }
            },
            created_at: '2024-02-01T10:00:00Z'
          }
        ];
        setClinics(demoClinics);
        setLoading(false);
        return;
      }

      // Fetch from database with proper error handling
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshClinics = async () => {
    setLoading(true);
    await fetchClinics();
  };

  useEffect(() => {
    fetchClinics();
  }, [doctor, isAdmin]);

  // Keep "All Clinics" as default selection
  // useEffect(() => {
  //   if (!selectedClinic && clinics.length > 0) {
  //     setSelectedClinic('all');
  //   }
  // }, [clinics, selectedClinic]);

  const value: ClinicContextType = {
    selectedClinic,
    setSelectedClinic,
    clinics,
    loading,
    refreshClinics
  };

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
};