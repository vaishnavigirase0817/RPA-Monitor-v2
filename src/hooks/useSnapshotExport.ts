import { useState, useCallback } from 'react';
import { generateCSVBlobAsync, generateFilename } from '../utils/csvExporter';
import type { StreamItem } from '../types/types';
import { useToast } from '../components/ToastProvider';

export const useSnapshotExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const exportSnapshot = useCallback(async (data: StreamItem[]) => {
    if (data.length === 0) {
      showToast("No data available to export.", "warning");
      return;
    }

    setIsExporting(true);

    try {
      const blob = await generateCSVBlobAsync(data);
      const url = URL.createObjectURL(blob);
      const filename = generateFilename();

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Memory management cleanup
      URL.revokeObjectURL(url);
      
      showToast("Snapshot exported successfully", "success");
    } catch (error) {
      showToast("Error exporting snapshot", "warning");
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  }, [showToast]);

  return { exportSnapshot, isExporting };
};
