import { useState } from 'react';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getLastMonthRange } from '../../utils/dateUtils';
import { DIM_OPTIONS } from '../../utils/constants';
import StatsCards from '../../components/Cards/StatsCards';
import DistributionPieChart from '../../components/Charts/DistributionPieChart';
import BreakdownChart from '../../components/Charts/BreakdownChart';

export default function HistoricFiles() {
  const [dateRange, setDateRange] = useState(getLastMonthRange());
  const [dim, setDim] = useState('sexo');
  
  const { data, loading, error, hasData } = useDataFetching({ 
    mode: 'historic',
    dateRange,
    dim
  });

  console.log('HistoricFiles render:', { dateRange, dim, data, loading, error });

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Data inici
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Data fi
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Dimensió
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

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-lg text-slate-600">
            Carregant dades...
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      ) : !hasData ? (
        <div className="text-center py-12">
          <div className="text-slate-600">No hi ha dades disponibles</div>
        </div>
      ) : (
        <>
          <StatsCards data={data.summary} />
          
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionPieChart data={data.summary} />
            <BreakdownChart 
              data={data.breakdown} 
              dimension={dim}
            />
          </section>
        </>
      )}
    </main>
  );
}