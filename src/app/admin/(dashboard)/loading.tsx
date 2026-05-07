export default function AdminLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <style>{`
        @keyframes pulse-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .loading-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-fade 1.2s ease-in-out infinite;
        }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="flex min-h-[60vh] flex-1 items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
          <span className="text-xs tracking-widest uppercase opacity-50">
            Cargando
          </span>
        </div>
      </div>
    </div>
  );
}
