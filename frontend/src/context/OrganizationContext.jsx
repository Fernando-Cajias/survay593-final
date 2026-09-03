import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getCurrentPeriod, DEFAULT_ACADEMIC_PERIODS } from '../services/educationTemplates';

const OrganizationContext = createContext(null);

const ORG_STORAGE_KEY = 'survey593_current_org';
const ORGS_STORAGE_KEY = 'survey593_organizations';
const PERIODS_STORAGE_KEY = 'survey593_periods';

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem(ORGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentOrg, setCurrentOrg] = useState(() => {
    const saved = localStorage.getItem(ORG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [periods, setPeriods] = useState(() => {
    const saved = localStorage.getItem(PERIODS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPeriod, setCurrentPeriod] = useState(() => {
    const defaultP = getCurrentPeriod();
    return defaultP ? { id: `period_default`, name: defaultP.name, ...defaultP, isCurrent: true } : null;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (currentOrg) {
      localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(currentOrg));
    } else {
      localStorage.removeItem(ORG_STORAGE_KEY);
    }
  }, [currentOrg]);

  useEffect(() => {
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(periods));
  }, [periods]);

  // Load organizations from Supabase
  useEffect(() => {
    async function loadOrgs() {
      if (!isSupabaseConfigured) return;
      try {
        const { data } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const mapped = data.map((o) => ({
            id: o.id,
            name: o.name,
            slug: o.slug,
            type: o.type,
            city: o.city,
            address: o.address,
            rectorName: o.rector_name,
            phone: o.phone,
            email: o.email,
            plan: o.plan,
            active: o.active,
            createdAt: o.created_at,
          }));
          setOrganizations(mapped);
        }
      } catch (err) {
        console.warn('Could not load organizations from Supabase:', err);
      }
    }
    loadOrgs();
  }, []);

  // Load periods for current org
  useEffect(() => {
    async function loadPeriods() {
      if (!isSupabaseConfigured || !currentOrg) return;
      try {
        const { data } = await supabase
          .from('academic_periods')
          .select('*')
          .eq('organization_id', currentOrg.id)
          .order('start_date', { ascending: false });

        if (data && data.length > 0) {
          const mapped = data.map((p) => ({
            id: p.id,
            organizationId: p.organization_id,
            name: p.name,
            startDate: p.start_date,
            endDate: p.end_date,
            isCurrent: p.is_current,
            createdAt: p.created_at,
          }));
          setPeriods(mapped);
          const activePeriod = mapped.find((p) => p.isCurrent) || mapped[0];
          if (activePeriod) setCurrentPeriod(activePeriod);
        }
      } catch (err) {
        console.warn('Could not load periods from Supabase:', err);
      }
    }
    loadPeriods();
  }, [currentOrg?.id]);

  // Create a new organization (tenant)
  const createOrganization = async (orgData) => {
    const slug = orgData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newOrg = {
      id: `org_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      name: orgData.name.trim(),
      slug,
      type: orgData.type || 'school',
      city: orgData.city || 'Quito',
      address: orgData.address || '',
      rectorName: orgData.rectorName || '',
      phone: orgData.phone || '',
      email: orgData.email || '',
      plan: 'starter',
      active: true,
      createdAt: new Date().toISOString(),
    };

    setOrganizations((prev) => [newOrg, ...prev]);
    setCurrentOrg(newOrg);

    // Create default academic periods for this org
    const defaultPeriods = DEFAULT_ACADEMIC_PERIODS.map((p, idx) => ({
      id: `period_${newOrg.id}_${idx}`,
      organizationId: newOrg.id,
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
      isCurrent: p.name === getCurrentPeriod()?.name,
      createdAt: new Date().toISOString(),
    }));

    setPeriods(defaultPeriods);
    const activePeriod = defaultPeriods.find((p) => p.isCurrent) || defaultPeriods[defaultPeriods.length - 1];
    setCurrentPeriod(activePeriod);

    // Persist to Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('organizations').insert([{
          id: newOrg.id,
          name: newOrg.name,
          slug: newOrg.slug,
          type: newOrg.type,
          city: newOrg.city,
          address: newOrg.address,
          rector_name: newOrg.rectorName,
          phone: newOrg.phone,
          email: newOrg.email,
          plan: newOrg.plan,
          active: true,
        }]);

        await supabase.from('academic_periods').insert(
          defaultPeriods.map((p) => ({
            id: p.id,
            organization_id: p.organizationId,
            name: p.name,
            start_date: p.startDate,
            end_date: p.endDate,
            is_current: p.isCurrent,
          }))
        );
      } catch (err) {
        console.warn('Error creating organization in Supabase:', err);
      }
    }

    return newOrg;
  };

  // Set active organization for the session
  const switchOrganization = (orgId) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) setCurrentOrg(org);
  };

  // Switch academic period
  const switchPeriod = (periodId) => {
    const period = periods.find((p) => p.id === periodId);
    if (period) setCurrentPeriod(period);
  };

  // Get org by invitation code (slug)
  const findOrgByCode = (code) => {
    return organizations.find(
      (o) => o.slug === code.toLowerCase().trim() || o.id === code.trim()
    );
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrg,
        periods,
        currentPeriod,
        createOrganization,
        switchOrganization,
        switchPeriod,
        findOrgByCode,
        setCurrentOrg,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error('useOrganization must be used within OrganizationProvider');
  return context;
};
