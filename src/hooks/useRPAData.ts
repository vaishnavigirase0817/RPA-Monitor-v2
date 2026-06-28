import { useState, useEffect, useCallback, useRef } from 'react';
import type { KPIData, StreamItem, AutomationType, Department, Industry, StreamTelemetry, Notification } from '../types/types';
import { MOCK_RPA_DATA_CONFIG } from '../constants/config';

const generateId = () => Math.random().toString(36).substring(7);

const generateMockItem = (): StreamItem => {
  const statuses: Array<'Running' | 'Completed' | 'Failed'> = ['Running', 'Running', 'Completed', 'Failed'];
  const automationTypes: AutomationType[] = ['Attended', 'Unattended', 'Hybrid'];
  const departments: Department[] = ['Finance', 'HR', 'IT', 'Operations', 'Sales'];
  const industries: Industry[] = ['Banking', 'Healthcare', 'Retail', 'Tech', 'Logistics'];
  const companies = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Corp', 'Stark Ind'];
  const partners = ['Accenture', 'Deloitte', 'PwC', 'KPMG', 'EY'];
  const countries = ['USA', 'UK', 'Germany', 'Japan', 'Australia'];
  
  const roi = (Math.random() * 550) - 50; 
  
  return {
    id: generateId(),
    robotName: `Bot-${Math.floor(Math.random() * 1000)}`,
    processName: `Process-${Math.floor(Math.random() * 100)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    rowsProcessed: Math.floor(Math.random() * 500),
    timestamp: Date.now(),
    budget: Math.floor(Math.random() * 50000) + 1000,
    roi: roi,
    employeeHours: Math.floor(Math.random() * 200) + 10,
    automationType: automationTypes[Math.floor(Math.random() * automationTypes.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    projectName: `Project-${generateId().toUpperCase()}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    partner: partners[Math.floor(Math.random() * partners.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
  };
};

export const useRPAData = (isPaused: boolean) => {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalStreamedRows: 1254300,
    activeRobots: 42,
    globalSavings: 8450200,
    roi: 345.67,
    completedProcesses: 312,
    failedProcesses: 18,
  });

  const [streamData, setStreamData] = useState<StreamItem[]>(() => {
    return Array.from({ length: 50 }, generateMockItem);
  });

  const [telemetry, setTelemetry] = useState<StreamTelemetry>({
    connectionStatus: 'Connecting',
    latencyMs: 0,
    lastHeartbeat: Date.now(),
    droppedFrames: 0,
    avgProcessingTimeMs: 0,
    packetsPerSecond: 0,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const queueRef = useRef<StreamItem[]>([]);
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const tickCountRef = useRef(0);
  const lastTickTimeRef = useRef(Date.now());

  // Simulate connection lifecycle
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setTelemetry(prev => ({ ...prev, connectionStatus: 'Connected', lastHeartbeat: Date.now() }));
      setNotifications(prev => [...prev, {
        id: generateId(), title: 'Stream Online', message: 'Connected to telemetry server',
        severity: 'success', timestamp: Date.now(), read: false, pinned: false,
      }]);
    }, 1500);

    const reconnectInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setTelemetry(prev => ({ ...prev, connectionStatus: 'Reconnecting' }));
        setNotifications(prev => [...prev, {
          id: generateId(), title: 'Reconnecting', message: 'Lost heartbeat, attempting recovery...',
          severity: 'warning', timestamp: Date.now(), read: false, pinned: false,
        }]);
        setTimeout(() => {
          setTelemetry(prev => ({ ...prev, connectionStatus: 'Connected', lastHeartbeat: Date.now() }));
        }, 2000);
      }
    }, 30000);

    return () => { clearTimeout(connectTimer); clearInterval(reconnectInterval); };
  }, []);

  // Heartbeat ticker
  useEffect(() => {
    const hb = setInterval(() => {
      if (telemetry.connectionStatus === 'Connected') {
        setTelemetry(prev => ({ ...prev, lastHeartbeat: Date.now() }));
      }
    }, 5000);
    return () => clearInterval(hb);
  }, [telemetry.connectionStatus]);

  const updateData = useCallback((timestamp: number) => {
    if (timestamp - lastUpdateRef.current >= MOCK_RPA_DATA_CONFIG.tickRateMs) {
      const tickStart = performance.now();
      const newItem = generateMockItem();
      tickCountRef.current++;

      if (newItem.status === 'Failed') {
        setNotifications(prev => {
          const next = [...prev, {
            id: generateId(), title: `Bot Failure: ${newItem.robotName}`,
            message: `${newItem.processName} has failed with ROI ${newItem.roi.toFixed(1)}%`,
            severity: 'error' as const, timestamp: Date.now(), read: false, pinned: false,
          }];
          return next.length > 50 ? next.slice(-50) : next;
        });
      }

      if (isPaused) {
        queueRef.current.push({ ...newItem, isNew: true });
      } else {
        let itemsToAdd: StreamItem[] = [{ ...newItem, isNew: true }];
        if (queueRef.current.length > 0) {
          const chunkSize = Math.min(queueRef.current.length, 5); 
          // Note: Items from the queue were already marked isNew when added to the queue
          itemsToAdd = [...itemsToAdd, ...queueRef.current.splice(0, chunkSize)];
        }

        setKpiData(prev => {
          let rowsAdded = 0;
          let savingsAdded = 0;
          let newCompleted = 0;
          let newFailed = 0;
          itemsToAdd.forEach(item => {
            rowsAdded += item.rowsProcessed;
            savingsAdded += (item.budget * 0.1);
            if (item.status === 'Completed') newCompleted++;
            if (item.status === 'Failed') newFailed++;
          });
          
          return {
            totalStreamedRows: prev.totalStreamedRows + rowsAdded,
            activeRobots: Math.max(10, prev.activeRobots + Math.floor(Math.random() * 5) - 2),
            globalSavings: prev.globalSavings + savingsAdded,
            roi: Math.min(1000, Math.max(0, prev.roi + (Math.random() * 2 - 1))),
            completedProcesses: prev.completedProcesses + newCompleted,
            failedProcesses: prev.failedProcesses + newFailed,
          };
        });

        setStreamData(prev => {
          // Reset isNew flag on existing items before adding new ones
          const prevCleaned = prev.map(item => item.isNew ? { ...item, isNew: false } : item);
          const next = [...itemsToAdd, ...prevCleaned];
          return next.length > MOCK_RPA_DATA_CONFIG.maxRows 
            ? next.slice(0, MOCK_RPA_DATA_CONFIG.maxRows)
            : next;
        });
      }
      
      const tickEnd = performance.now();
      const processingTime = tickEnd - tickStart;
      
      const now = Date.now();
      if (now - lastTickTimeRef.current >= 1000) {
        setTelemetry(prev => ({
          ...prev,
          latencyMs: Math.round(5 + Math.random() * 15),
          packetsPerSecond: tickCountRef.current,
          avgProcessingTimeMs: Math.round(processingTime * 100) / 100,
        }));
        tickCountRef.current = 0;
        lastTickTimeRef.current = now;
      }
      
      lastUpdateRef.current = timestamp;
    }

    animationFrameRef.current = requestAnimationFrame(updateData);
  }, [isPaused]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateData);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [updateData]);

  useEffect(() => {
    if (!isPaused && queueRef.current.length > 0) {
      const flushInterval = setInterval(() => {
        if (queueRef.current.length === 0) {
          clearInterval(flushInterval);
          return;
        }
        const chunk = queueRef.current.splice(0, 10);
        setStreamData(prev => {
           const next = [...chunk, ...prev];
           return next.length > 5000 ? next.slice(0, 5000) : next;
        });
      }, 100);
      return () => clearInterval(flushInterval);
    }
  }, [isPaused]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { 
    kpiData, 
    streamData, 
    queueSize: queueRef.current.length, 
    telemetry, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    clearNotifications,
  };
};
