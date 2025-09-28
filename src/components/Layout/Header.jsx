export default function Header({ mode, asOf, dateRange, onAsOfChange, onDateRangeChange, dim, onDimChange }) {
  return (
    <div className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header className="flex flex-col gap-6 py-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              CEDH BCS · Estadístiques públiques <span className="text-slate-400">(DOQ)</span>
            </h1>
            <p className="text-sm text-slate-600">
              {mode === 'active' 
                ? 'Situació a una data de tall determinada'
                : 'Expedients creats en el període seleccionat'}
              . Dades anònimes des de Plataforma de Gestió.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            {mode === 'active' ? (
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-slate-600 mb-2">Data de tall</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={asOf}
                  onChange={(e) => onAsOfChange(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Data inici</label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Data fi</label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-slate-600 mb-2">Dimensió d'anàlisi</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dim}
                onChange={(e) => onDimChange(e.target.value)}
              >
                {DIM_OPTIONS.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}