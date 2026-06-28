import { useState, useEffect } from 'react';
import { useToast } from '../components/ToastProvider';

interface GlobalSettings {
  themeLock: boolean;
  enableAnimations: boolean;
  denseGrid: boolean;
  notifications: boolean;
}

export const SettingsView = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('rpa_global_settings');
    if (saved) return JSON.parse(saved);
    return {
      themeLock: true,
      enableAnimations: true,
      denseGrid: false,
      notifications: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('rpa_global_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof GlobalSettings) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`Setting updated: ${key}`, 'info');
      return next;
    });
  };

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col gap-6 animate-fade-in">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-wide">Global Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Configure layout preferences, animations, and system notifications.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl space-y-4">
          
          <div className="bg-navy/40 backdrop-blur-md border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
            <div>
              <h3 className="text-white font-bold mb-1">Theme Lock (Always Dark)</h3>
              <p className="text-sm text-gray-500">Enforce enterprise dark mode globally.</p>
            </div>
            <button 
              onClick={() => toggleSetting('themeLock')}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.themeLock ? 'bg-electric-blue' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.themeLock ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="bg-navy/40 backdrop-blur-md border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
            <div>
              <h3 className="text-white font-bold mb-1">Enable Global Animations</h3>
              <p className="text-sm text-gray-500">Allow CSS transitions, glows, and background meshes.</p>
            </div>
            <button 
              onClick={() => toggleSetting('enableAnimations')}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.enableAnimations ? 'bg-electric-blue' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableAnimations ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="bg-navy/40 backdrop-blur-md border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
            <div>
              <h3 className="text-white font-bold mb-1">Dense Grid Layout</h3>
              <p className="text-sm text-gray-500">Reduce row padding in the Virtual Telemetry Grid.</p>
            </div>
            <button 
              onClick={() => toggleSetting('denseGrid')}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.denseGrid ? 'bg-electric-blue' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.denseGrid ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="bg-navy/40 backdrop-blur-md border border-white/10 p-5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
            <div>
              <h3 className="text-white font-bold mb-1">System Notifications</h3>
              <p className="text-sm text-gray-500">Allow bot failure alerts in the notification drawer.</p>
            </div>
            <button 
              onClick={() => toggleSetting('notifications')}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-electric-blue' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
