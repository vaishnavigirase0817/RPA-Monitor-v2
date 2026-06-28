import { useState, useEffect } from 'react';
import type { LayoutPreferences } from '../types/types';

const STORAGE_KEY = 'rpa-monitor-layout-prefs';

const defaultPreferences: LayoutPreferences = {
  showKPIs: true,
  showToolbar: true,
  showGrid: true,
  showAnalytics: false,
};

export const useLayoutPreferences = () => {
  const [preferences, setPreferences] = useState<LayoutPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load layout preferences', e);
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const togglePreference = (key: keyof LayoutPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return { preferences, togglePreference };
};
