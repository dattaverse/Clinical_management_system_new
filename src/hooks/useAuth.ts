import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Doctor, Admin } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    console.log('Auth hook initializing...');
    
    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          console.log('Demo mode - creating demo user');
          // Demo mode - create a mock user immediately
          const demoUser = {
            id: 'demo-user-id',
            email: 'demo@healthsphere.com',
            user_metadata: {}
          };
          const demoDoctor: Doctor = {
            id: 'demo-user-id',
            email: 'demo@healthsphere.com',
            name: 'Dr. Demo User',
            country: 'US',
            phone: '+1 (555) 123-4567',
            timezone: 'UTC',
            subscription_plan: 'pro',
            ai_minutes_used: 120,
            msg_quota_used: 432,
            created_at: new Date().toISOString()
          };
          
          setUser(demoUser);
          setDoctor(demoDoctor);
          setAdmin(null);
          setIsAdmin(false);
          setLoading(false);
          console.log('Demo user created successfully');
          return;
        }

        // Real Supabase mode
        console.log('Checking Supabase session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session:', session.user.email);
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          console.log('No existing session found');
          setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id, session.user.email);
          } else {
            setUser(null);
            setDoctor(null);
            setAdmin(null);
            setIsAdmin(false);
            setLoading(false);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      console.log('Fetching user profile for:', userId, email);
      
      // Check for default admin
      if (email === 'admin@healthsphere.com') {
        console.log('Default admin detected');
        const defaultAdmin: Admin = {
          id: 'admin-id',
          user_id: userId,
          email: email,
          name: 'Dr. Sarah Johnson',
          role: 'super_admin',
          permissions: {
            view_all: true,
            manage_doctors: true,
            view_logs: true,
            compliance: true
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setAdmin(defaultAdmin);
        setIsAdmin(true);
        setDoctor(null);
        setLoading(false);
        return;
      }

      // Check if user is admin in database
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminData) {
        console.log('Admin profile found:', adminData.name);
        setAdmin(adminData);
        setIsAdmin(true);
        setDoctor(null);
        setLoading(false);
        return;
      }

      // Check if user is doctor
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (doctorData) {
        console.log('Doctor profile found:', doctorData.name);
        setDoctor(doctorData);
        setIsAdmin(false);
        setAdmin(null);
        setLoading(false);
        return;
      }

      // Create default doctor profile if none exists
      console.log('Creating default doctor profile');
      const doctorName = getUserNameFromEmail(email);
      const defaultDoctor: Doctor = {
        id: userId,
        email: email,
        name: doctorName,
        country: 'US',
        phone: '+1 (555) 123-4567',
        timezone: 'UTC',
        subscription_plan: 'starter',
        ai_minutes_used: 0,
        msg_quota_used: 0,
        created_at: new Date().toISOString()
      };

      // Try to insert into database, but don't fail if it doesn't work
      try {
        await supabase.from('doctors').insert([defaultDoctor]);
      } catch (insertError) {
        console.log('Could not insert doctor profile, using local data');
      }

      setDoctor(defaultDoctor);
      setIsAdmin(false);
      setAdmin(null);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  // Helper function to generate a proper name from email
  const getUserNameFromEmail = (email: string): string => {
    // Handle specific known emails
    if (email === 'rghatwai@gmail.com') {
      return 'Dr. Rahul Ghatwai';
    }
    if (email === 'admin@healthsphere.com') {
      return 'System Administrator';
    }
    if (email === 'doctor@healthsphere.com') {
      return 'Dr. Michael Chen';
    }
    
    const username = email.split('@')[0];
    
    // Special handling for rghatwai
    if (username === 'rghatwai') {
      return 'Dr. Rahul Ghatwai';
    }
    
    // For other emails, create a proper doctor name
    if (username.includes('ghatwai') || username.includes('rahul')) {
      return 'Dr. Rahul Ghatwai';
    }
    
    // Default formatting for other emails
    const nameParts = username.split(/[._-]/);
    const formattedName = nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    return `Dr. ${formattedName}`;
  };
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      console.log('Demo sign in for:', email);
      setLoading(true);
      const demoUser = {
        id: 'demo-user-id',
        email: email
      };
      
      if (email === 'admin@healthsphere.com') {
        const demoAdmin: Admin = {
          id: 'admin-user-id',
          user_id: 'admin-user-id',
          email: email,
          name: 'System Administrator',
          role: 'super_admin',
          permissions: {
            view_all: true,
            manage_doctors: true,
            view_logs: true,
            compliance: true
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUser(demoUser);
        setAdmin(demoAdmin);
        setIsAdmin(true);
        setDoctor(null);
      } else {
        const demoDoctor: Doctor = {
          id: 'demo-user-id',
          email: email,
          name: 'Dr. Demo User',
          country: 'US',
          phone: '+1 (555) 123-4567',
          timezone: 'UTC',
          subscription_plan: 'pro',
          ai_minutes_used: 120,
          msg_quota_used: 432,
          created_at: new Date().toISOString()
        };
        setUser(demoUser);
        setDoctor(demoDoctor);
        setIsAdmin(false);
        setAdmin(null);
      }
      setLoading(false);
      return { data: { user: demoUser }, error: null };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase sign in error:', error);
        setLoading(false);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    if (!isSupabaseConfigured) {
      console.log('Demo sign up for:', email);
      setLoading(true);
      const demoUser = {
        id: 'demo-user-id',
        email: email
      };
      
      const demoDoctor: Doctor = {
        id: 'demo-user-id',
        email: email,
        name: userData?.name || 'New Doctor',
        country: userData?.country || 'US',
        phone: userData?.phone || '',
        timezone: 'UTC',
        subscription_plan: 'starter',
        ai_minutes_used: 0,
        msg_quota_used: 0,
        created_at: new Date().toISOString()
      };
      
      setUser(demoUser);
      setDoctor(demoDoctor);
      setIsAdmin(false);
      setAdmin(null);
      setLoading(false);
      return { data: { user: demoUser }, error: null };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: userData
        }
      });
      
      if (error) {
        console.error('Supabase sign up error:', error);
        setLoading(false);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = useCallback(async () => {
    console.log('signOut called, isSupabaseConfigured:', isSupabaseConfigured);
    
    // Immediately clear all local state first
    setUser(null);
    setDoctor(null);
    setAdmin(null);
    setIsAdmin(false);
    setLoading(false);
    
    if (!isSupabaseConfigured) {
      console.log('Demo mode - clearing user state');
      return;
    }

    try {
      console.log('Attempting Supabase signOut...');
      
      // Force clear the session from localStorage first
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Try to sign out, but don't fail if it errors
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (signOutError) {
        console.log('Supabase signOut failed (expected):', signOutError);
      }
      
      console.log('Supabase signOut completed');
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
    
    console.log('User state cleared, should redirect to landing page');
  }, []);
  return {
    user,
    doctor,
    admin,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut
  };
};