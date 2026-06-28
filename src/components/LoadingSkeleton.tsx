export const LoadingSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col gap-3 p-4 opacity-50">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="h-12 w-full bg-white/5 rounded-md relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[scan_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>
        </div>
      ))}
    </div>
  );
};
