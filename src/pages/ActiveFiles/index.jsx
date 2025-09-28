import { useState, useEffect } from 'react';
import { useDataFetching } from '../../hooks/useDataFetching';
import { DIM_OPTIONS } from '../../utils/constants';
import StatsCards from '../../components/Cards/StatsCards';
import DistributionPieChart from '../../components/Charts/DistributionPieChart';
import BreakdownChart from '../../components/Charts/BreakdownChart';

export default function ActiveFiles() {
  const [asOf, setAsOf] = useState(new Date().toISOString().split('T')[0]);
  const [dim, setDim] = useState('sexo');
  
  const { data, loading, error, hasData } = useDataFetching({ 
    mode: 'active',
    asOf,
    dim
  });

  useEffect(() => {
    if (error) {
      console.error('Error al cargar los datos:', error);
    }
  }, [error]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <div className="text-center py-12">
          <div className="animate-pulse text-lg text-slate-600">
            Cargando datos...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <div className="text-center py-12">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </main>
    );
  }

  if (!hasData) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <div className="text-center py-12">
          <div className="text-slate-600">No hay datos disponibles</div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Fecha de corte
          </label>
          <input
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Dimensión
          </label>
          <select
            value={dim}
            onChange={(e) => setDim(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
          >
            {DIM_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <StatsCards data={data.summary} />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionPieChart data={data.summary} />
        <BreakdownChart 
          data={data.breakdown} 
          dimension={dim}
        />
      </div>
    </main>
  );
}