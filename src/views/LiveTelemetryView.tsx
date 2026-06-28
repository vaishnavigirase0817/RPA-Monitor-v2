import { memo } from 'react';
import { Toolbar } from '../components/Toolbar';
import { KPISection } from '../components/KPISection';
import { VirtualGridPlaceholder } from '../components/VirtualGridPlaceholder';
import { StatusFooter } from '../components/StatusFooter';
import type { LayoutPreferences, StreamItem, KPIData, StreamTelemetry } from '../types/types';
import type { FilterState } from '../hooks/useSortAndFilter';
import type { ColumnDef } from '../hooks/useColumnManager';
import type { SortCriteria } from '../types/types';

interface LiveTelemetryViewProps {
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
  queueSize: number;
  preferences: LayoutPreferences;
  togglePreference: (key: keyof LayoutPreferences) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  columns: ColumnDef[];
  toggleColumnVisibility: (id: keyof StreamItem) => void;
  resizeColumn: (id: keyof StreamItem, width: number) => void;
  processedData: StreamItem[];
  streamDataLength: number;
  sortCriteria: SortCriteria[];
  handleSort: (column: keyof StreamItem, isShiftPressed: boolean) => void;
  isLoading: boolean;
  selectedIds: Set<string>;
  toggleSelection: (id: string, isShift: boolean, visibleData: StreamItem[]) => void;
  selectAll: (visibleData: StreamItem[]) => void;
  clearSelection: () => void;
  fps: number;
  rps: number;
  telemetry: StreamTelemetry;
  kpiData: KPIData;
  onOpenAnalytics: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const LiveTelemetryView = memo(({
  isFullscreen, setIsFullscreen, isPaused, setIsPaused, queueSize, preferences, togglePreference,
  filters, setFilters, columns, toggleColumnVisibility, resizeColumn, processedData, streamDataLength,
  sortCriteria, handleSort, isLoading, selectedIds, toggleSelection, selectAll, clearSelection,
  fps, rps, telemetry, kpiData, onOpenAnalytics, showToast
}: LiveTelemetryViewProps) => {

  return (
    <div className={`flex-1 flex flex-col min-h-0 overflow-hidden ${isFullscreen ? 'p-0' : 'p-5'}`}>
      {!isFullscreen && preferences.showToolbar && (
        <Toolbar 
          isPaused={isPaused}
          onTogglePause={() => { 
            setIsPaused(!isPaused); 
            showToast(!isPaused ? 'Stream Paused' : 'Stream Resumed', !isPaused ? 'warning' : 'success'); 
          }}
          queueSize={queueSize}
          layoutPrefs={preferences}
          onToggleLayout={togglePreference}
          filters={filters}
          onFilterChange={setFilters}
          columns={columns}
          onToggleColumn={toggleColumnVisibility}
          onOpenAnalytics={onOpenAnalytics}
          processedData={processedData}
          selectedIds={selectedIds}
        />
      )}

      {!isFullscreen && preferences.showKPIs && <KPISection data={kpiData} />}
      
      {(preferences.showGrid || isFullscreen) && (
        <div className="flex-1 flex flex-col min-h-0 relative mt-2">
          {isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-2 right-6 z-50 px-3 py-1 bg-white/10 hover:bg-soft-orange/20 text-white rounded text-xs tracking-wider"
            >
              EXIT FULLSCREEN (F)
            </button>
          )}
          <VirtualGridPlaceholder 
            data={processedData} 
            sortCriteria={sortCriteria}
            onSort={handleSort}
            isLoading={isLoading}
            columns={columns}
            resizeColumn={resizeColumn}
            isPaused={isPaused}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
          />
        </div>
      )}

      {!isFullscreen && (
        <div className="mt-5 shrink-0">
          <StatusFooter 
            fps={fps} 
            rps={rps} 
            telemetry={telemetry} 
            queueSize={queueSize}
            totalRows={streamDataLength}
          />
        </div>
      )}
    </div>
  );
});
