import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const SparklineGraph = ({ 
  data, 
  color = '#00e5ff', 
  width = 100, 
  height = 40 
}: SparklineProps) => {
  const path = useMemo(() => {
    if (data.length === 0) return '';
    
    const max = Math.max(...data) || 1;
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Normalize data points to fit within SVG dimensions
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      // Invert Y because SVG origin (0,0) is top-left
      const y = height - ((val - min) / range) * height * 0.8 - (height * 0.1); 
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  // Create an area under the curve for a gradient effect
  const areaPath = useMemo(() => {
    if (!path) return '';
    return `${path} L ${width},${height} L 0,${height} Z`;
  }, [path, width, height]);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      {data.length > 1 && (
        <path 
          d={areaPath} 
          fill={`url(#gradient-${color})`} 
          className="transition-all duration-300 ease-out" 
        />
      )}
      {/* Line */}
      {data.length > 1 && (
        <path 
          d={path} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="transition-all duration-300 ease-out"
          style={{ filter: `drop-shadow(0px 0px 4px ${color})` }}
        />
      )}
    </svg>
  );
};
