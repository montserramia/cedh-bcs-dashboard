export default function TimeStats({ expedients }) {
  // Calculem estadístiques
  const stats = expedients.reduce((acc, exp) => {
    if (exp.estado_actual === 'Archivado') {
      acc.totalConcluidos++;
      acc.diasTotales += exp.dias_transcurridos;
    }
    
    // Trobem l'expedient més antic
    if (exp.dias_transcurridos > acc.maxDias) {
      acc.maxDias = exp.dias_transcurridos;
      acc.expedienteMasAntiguo = exp;
    }
    
    return acc;
  }, { 
    totalConcluidos: 0, 
    diasTotales: 0, 
    maxDias: 0,
    expedienteMasAntiguo: null 
  });

  const promedioDias = stats.totalConcluidos > 0 
    ? Math.round(stats.diasTotales / stats.totalConcluidos)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-slate-600">Temps mitjà de resolució</h4>
        <p className="text-2xl font-semibold mt-1">{promedioDias} dies</p>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-slate-600">Expedients conclosos</h4>
        <p className="text-2xl font-semibold mt-1">{stats.totalConcluidos}</p>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-slate-600">Expedient més antic</h4>
        <p className="text-2xl font-semibold mt-1">{stats.maxDias} dies</p>
        <p className="text-sm text-slate-500 mt-1">
          {stats.expedienteMasAntiguo?.fecha_creacion || '-'}
        </p>
      </div>
    </div>
  );
}