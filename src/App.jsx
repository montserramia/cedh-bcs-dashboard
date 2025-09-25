import React, { useEffect, useMemo, useState } from "react";

/**
 * CEDH DOQ – Public Dashboard (React mock)
 * -----------------------------------------------------
 * Single-file React component to visualize the Drupal JSON endpoints:
 *   - /api/doq/public/summary?as_of=YYYY-MM-DD
 *   - /api/doq/public/breakdown?as_of=YYYY-MM-DD&dim=sexo|grupo_prioritario|municipio|autoridad|derechos
 *   - /api/doq/public/movimientos?start=YYYY-MM-DD&end=YYYY-MM-DD
 *   - /api/doq/public/list?as_of=YYYY-MM-DD&page=1&page_size=20
 *
 * Styling: TailwindCSS (assumed present)
 * Charts: Recharts (assumed installed)
 *
 * Notes:
 * - By default, uses today's date (local) as `as_of`.
 * - Base URL is relative (same origin); adjust BASE_URL if needed.
 */

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// const BASE_URL = "https://cedh-bcs.ddev.site:8443"; // e.g. "" (same origin) or "https://cedh-bcs.ddev.site"
const BASE_URL = import.meta.env.VITE_API_BASE || "";
// Paleta consistent per als 4 indicadors
const SERIES = [
  { key: "quejas",            name: "Quejas",            color: "#5B8FF9" },
  { key: "canalizaciones",    name: "Canalizaciones",    color: "#61DDAA" },
  { key: "orientaciones",     name: "Orientaciones",     color: "#F6BD16" },
  { key: "acompanamientos",   name: "Acompañamientos",   color: "#9661BC" },
];

async function fetchJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDateInputValue(d) {
  // YYYY-MM-DD from Date in local time
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

const DIM_OPTIONS = [
  { key: "sexo", label: "Sexo" },
  { key: "grupo_prioritario", label: "Grupo prioritario" },
  { key: "municipio", label: "Municipio" },
  { key: "autoridad", label: "Autoridad" },
  { key: "derechos", label: "Derechos" },
];

export default function CEDH_DOQ_Public_Dashboard() {
  const [asOf, setAsOf] = useState(formatDateInputValue(new Date()));
  const [dim, setDim] = useState("sexo");

  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [list, setList] = useState({ results: [], total: 0, page: 1, page_size: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Load all data for the current asOf + dim
  async function loadData(signal) {
    setLoading(true);
    setError("");
    try {
      const [s, b, l] = await Promise.all([
        fetchJSON(`/api/doq/public/summary?as_of=${asOf}`),
        fetchJSON(`/api/doq/public/breakdown?as_of=${asOf}&dim=${dim}`),
        fetchJSON(`/api/doq/public/list?as_of=${asOf}&page=${page}&page_size=${pageSize}`),
      ]);
      if (signal?.aborted) return;
      setSummary(s);
      setBreakdown(b);
      setList(l);
    } catch (e) {
      if (!signal?.aborted) setError(String(e.message || e));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const ctl = new AbortController();
    loadData(ctl.signal);
    return () => ctl.abort();
  }, [asOf, dim, page]);

  const cards = useMemo(() => {
    if (!summary) return [];
    const c = summary.cards || {};
    return [
      { key: "quejas", label: "Quejas", value: c.quejas ?? 0 },
      { key: "canalizaciones", label: "Canalizaciones", value: c.canalizaciones ?? 0 },
      { key: "orientaciones", label: "Orientaciones", value: c.orientaciones ?? 0 },
      { key: "acompanamientos", label: "Acompañamientos", value: c.acompanamientos ?? 0 },
      { key: "total", label: "Total", value: c.total ?? 0 },
    ];
  }, [summary]);

  // Transform breakdown into chart-friendly arrays
  const bdData = useMemo(() => {
    if (!breakdown) return { pie: [], bars: [] };
    const keys = ["quejas", "canalizaciones", "orientaciones", "acompanamientos"];

    // Pie with the 4 indicators (sum of all labels inside each)
    const pie = keys.map((k) => ({ name: k, value: Object.values(breakdown[k] || {}).reduce((a, b) => a + b, 0) }));

    // Bars: build rows like { label: 'Mujer', quejas: 12, canalizaciones: 3, ... }
    const labelSet = new Set();
    keys.forEach((k) => Object.keys(breakdown[k] || {}).forEach((label) => labelSet.add(label)));
    const labels = Array.from(labelSet);
    const bars = labels.map((label) => {
      const row = { label };
      keys.forEach((k) => { row[k] = (breakdown[k] || {})[label] || 0; });
      return row;
    });

    return { pie, bars };
  }, [breakdown]);

  const COLORS = ["#5B8FF9", "#61DDAA", "#65789B", "#F6BD16", "#7262fd", "#78D3F8", "#9661BC", "#F6903D"]; // default palette

  const pieIsEmpty = !bdData.pie?.some(d => d.value > 0);

  console.log('Pie data:', bdData.pie);
  console.log('Bar data:', bdData.bars);

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <div className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <header className="flex flex-col gap-2 py-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                CEDH BCS · Estadísticas públicas <span className="text-slate-400">(DOQ)</span>
              </h1>
              <p className="text-sm text-slate-600">
                Situación a una fecha de corte determinada. Datos anónimos desde Plataforma de Gestión.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Fecha de corte </label>
                <input
                  type="date"
                  className="mt-1 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={asOf}
                  onChange={(e) => { setPage(1); setAsOf(e.target.value); }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Dimensión </label>
                <select
                  className="mt-1 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={dim}
                  onChange={(e) => { setPage(1); setDim(e.target.value); }}
                >
                  {DIM_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">al {asOf}</span>
            </div>
          </header>
        </div>
      </div>

      {/* Badges ràpids amb totals del breakdown */}
      <div className="mt-2 flex flex-wrap gap-2">
        {SERIES.map(s => {
          const total = Object.values(breakdown?.[s.key] || {}).reduce((a,b)=>a+b,0);
          return (
            <span
              key={s.key}
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
              style={{ borderColor: s.color, color: s.color }}
            >
              {s.name}: <span className="ml-1 tabular-nums">{total.toLocaleString()}</span>
            </span>
          );
        })}
      </div>

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        {/* Cards */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {cards.map((c, i) => (
            <div key={c.key} className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{c.label}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">
                {loading && !summary ? '…' : c.value.toLocaleString()}
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-semibold">Repartiment per indicador</h2>
            </div>
            
            {/* Contenidor amb alçada fixa */}
            <div className="h-[400px] w-full"> {/* Canvia l'alçada segons necessitis */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={bdData.pie} 
                    dataKey="value" 
                    nameKey="name"
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100}
                  >
                    {bdData.pie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm lg:col-span-2">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-semibold">
                Desglossament per {DIM_OPTIONS.find(d => d.key === dim)?.label}
              </h2>
            </div>
            <div className="h-72 px-2 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bdData.bars} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {SERIES.map(s => (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      stackId="a"
                      name={s.name}
                      fill={s.color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mt-6 card overflow-hidden">
          <div className="card-pad border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-semibold">Expedients</h2>
            <div className="text-xs text-slate-500">{(list.total ?? 0).toLocaleString()} resultats</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">ID</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Indicador</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Estat actual</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Municipi</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Autoritat</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Drets</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Sexe</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-medium bg-slate-50">Dies</th>
                </tr>
              </thead>
              <tbody>
                {(list.results || []).map((row, idx) => (
                  <tr key={row.id_public} className={idx % 2 === 0 ? "bg-slate-50/50 border-b border-slate-100" : "border-b border-slate-100"}>
                    <td className="px-3 py-2 font-mono text-xs">{row.id_public}</td>
                    <td className="px-3 py-2 capitalize">{row.indicador_publico}</td>
                    <td className="px-3 py-2">{row.estado_actual}</td>
                    <td className="px-3 py-2">{row.municipio || "—"}</td>
                    <td className="px-3 py-2">{(row.autoridad_labels||[]).join(", ")}</td>
                    <td className="px-3 py-2">{(row.derechos_labels||[]).join(", ")}</td>
                    <td className="px-3 py-2">{(row.sexo_labels||[]).join(", ")}</td>
                    <td className="px-3 py-2 tabular-nums">{row.dias_transcurridos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="card-pad flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Pàgina {page} de {Math.max(1, Math.ceil((list.total || 0) / pageSize))}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <button
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil((list.total || 0) / pageSize)}
              >
                Següent
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-xs text-slate-500">
          {error ? (
            <div className="text-red-600">Error: {error}</div>
          ) : loading ? (
            <div>Carregant…</div>
          ) : (
            <div>Font: API pública Drupal (/api/doq/public/*). Sense PII. Última càrrega {new Date().toLocaleString()}.</div>
          )}
        </footer>
        </main>
    </div>
  );
}
