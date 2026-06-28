import type { StreamItem } from '../types/types';

export const generateCSVBlobAsync = (data: StreamItem[]): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (data.length === 0) {
      reject(new Error("No data available to export."));
      return;
    }

    // Automatically detect all keys from the first object
    const headers = Object.keys(data[0]) as Array<keyof StreamItem>;
    const csvRows: string[] = [headers.join(',')];
    
    let currentIndex = 0;
    const CHUNK_SIZE = 250; // Process 250 rows per tick to avoid freezing

    const processChunk = (deadline: IdleDeadline | { timeRemaining: () => number, didTimeout: boolean }) => {
      try {
        while (currentIndex < data.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
          const chunkEnd = Math.min(currentIndex + CHUNK_SIZE, data.length);
          
          for (let i = currentIndex; i < chunkEnd; i++) {
            const row = data[i];
            const rowString = headers.map(header => {
              const val = row[header];
              if (typeof val === 'string') {
                return `"${val.replace(/"/g, '""')}"`;
              }
              // Handle undefined/null gracefully
              return val ?? '';
            }).join(',');
            csvRows.push(rowString);
          }
          currentIndex = chunkEnd;
        }

        if (currentIndex < data.length) {
          // Keep chunking
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(processChunk as any, { timeout: 1000 });
          } else {
            setTimeout(() => processChunk({ timeRemaining: () => 10, didTimeout: false }), 0);
          }
        } else {
          // Finished processing all rows
          const csvString = csvRows.join('\n');
          const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
          resolve(blob);
        }
      } catch (error) {
        reject(error);
      }
    };

    // Start the process
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(processChunk as any, { timeout: 1000 });
    } else {
      setTimeout(() => processChunk({ timeRemaining: () => 10, didTimeout: false }), 0);
    }
  });
};

export const generateFilename = (): string => {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  
  return `RPA_Snapshot_${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}.csv`;
};
