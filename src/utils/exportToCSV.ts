import type { StreamItem } from '../types/types';

export const exportToCSV = (data: StreamItem[], filename: string = 'rpa_monitor_export.csv') => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]) as Array<keyof StreamItem>;
  
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const val = row[header];
        if (typeof val === 'string') {
          // Escape quotes and wrap in quotes
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  downloadBlob(blob, filename);
};

export const exportToJSON = (data: StreamItem[], filename: string = 'rpa_monitor_export.json') => {
  if (data.length === 0) return;

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  
  downloadBlob(blob, filename);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
