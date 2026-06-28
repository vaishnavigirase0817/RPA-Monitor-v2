interface StatusDistributionProps {
  completed: number;
  failed: number;
  running: number;
  size?: number;
  strokeWidth?: number;
}

export const StatusDistribution = ({ 
  completed = 0, 
  failed = 0, 
  running = 0, 
  size = 64, 
  strokeWidth = 8 
}: StatusDistributionProps) => {
  const safeCompleted = Number(completed) || 0;
  const safeFailed = Number(failed) || 0;
  const safeRunning = Number(running) || 0;
  
  const total = safeCompleted + safeFailed + safeRunning;
  const safeTotal = Math.max(1, total); // Prevent division by 0
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const getStrokeDasharray = (value: number) => {
    return `${(value / safeTotal) * circumference} ${circumference}`;
  };

  const getStrokeDashoffset = (previousValues: number[]) => {
    const sum = previousValues.reduce((a, b) => a + b, 0);
    // Offset is negative because SVG stroke-dashoffset goes counter-clockwise
    return -((sum / safeTotal) * circumference);
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Track */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth={strokeWidth} 
        />
        
        {/* Completed Segment */}
        {completed > 0 && (
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            fill="none" 
            stroke="#34d399" // emerald-400
            strokeWidth={strokeWidth}
            strokeDasharray={getStrokeDasharray(completed)}
            strokeDashoffset={getStrokeDashoffset([])}
            className="transition-all duration-500 ease-out"
          />
        )}
        
        {/* Failed Segment */}
        {failed > 0 && (
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            fill="none" 
            stroke="#ff9f43" // soft-orange
            strokeWidth={strokeWidth}
            strokeDasharray={getStrokeDasharray(failed)}
            strokeDashoffset={getStrokeDashoffset([completed])}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Running Segment */}
        {running > 0 && (
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            fill="none" 
            stroke="#00e5ff" // electric-blue
            strokeWidth={strokeWidth}
            strokeDasharray={getStrokeDasharray(running)}
            strokeDashoffset={getStrokeDashoffset([completed, failed])}
            className="transition-all duration-500 ease-out"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
        {total}
      </div>
    </div>
  );
};
