import { useState } from 'react';
import { useHistoricDataFetching } from '../../hooks/useHistoricDataFetching';
import StatsCards from '../../components/Cards/StatsCards';
import DistributionPieChart from '../../components/Charts/DistributionPieChart';
import PipelineChart from '../../components/Charts/PipelineChart';

function getLastMonthRange() {
  const today = new Date();
  
  // Retrocedim un mes per obtenir el mes anterior
  const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
  
  // Obtenim el primer dia del mes
  const start = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
  
  // Obtenim l'últim dia del mes
  const end = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
  
  // Formatem les dates en YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  console.log('Dates calculades:', {
    start: formatDate(start),
    end: formatDate(end)
  });

  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}

export default function HistoricFiles() {
  // Utilitzem la funció per inicialitzar l'estat
  const [dateRange, setDateRange] = useState(getLastMonthRange());
  
  const { data, loading, error, hasData } = useHistoricDataFetching({ dateRange });

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Fecha de inicio
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
            Fecha fin
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-lg text-slate-600">
            Cargando datos...
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      ) : !hasData ? (
        <div className="text-center py-12">
          <div className="text-slate-600">No hay datos disponibles</div>
        </div>
      ) : (
        <>
          <StatsCards data={data.cards} />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionPieChart data={data.cards} />
            <PipelineChart data={data.pipeline_quejas} />
          </div>
        </>
      )}
    </main>
  );
}