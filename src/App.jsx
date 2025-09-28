import React from "react";
import ActiveFiles from './pages/ActiveFiles';
import HistoricFiles from './pages/HistoricFiles';

export default function App() {
  const [viewMode, setViewMode] = React.useState('active');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-slate-900">
              CEDH BCS · Estadístiques públiques (DOQ)
            </h1>
            
            <div className="inline-flex gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'active'
                    ? 'bg-white shadow text-blue-700'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
                onClick={() => setViewMode('active')}
              >
                Expedients actius
              </button>
              <button
                className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'historic'
                    ? 'bg-white shadow text-blue-700'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
                onClick={() => setViewMode('historic')}
              >
                Històric
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {viewMode === 'active' ? <ActiveFiles /> : <HistoricFiles />}
      </div>
    </div>
  );
}
