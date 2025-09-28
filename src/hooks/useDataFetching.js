import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDataFetching({ mode, asOf, dateRange, dim }) {
  const [data, setData] = useState({ summary: null, breakdown: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      try {
        setLoading(true);
        
        const baseUrl = import.meta.env.VITE_API_BASE;
        
        // Només fem servir les crides que sabem que existeixen
        const breakdownUrl = `${baseUrl}/api/doq/public/breakdown?as_of=${asOf}&dim=${dim}`;

        console.log('📡 Cargando datos de:', { breakdownUrl });

        const breakdownRes = await axios.get(breakdownUrl);

        if (!isSubscribed) return;

        if (breakdownRes.data) {
          // Calculem el summary sumant els valors de cada categoria
          const summary = {
            quejas: Object.values(breakdownRes.data.quejas || {}).reduce((a, b) => a + b, 0),
            orientaciones: Object.values(breakdownRes.data.orientaciones || {}).reduce((a, b) => a + b, 0),
            canalizaciones: Object.values(breakdownRes.data.canalizaciones || {}).reduce((a, b) => a + b, 0),
            acompanamientos: Object.values(breakdownRes.data.acompanamientos || {}).reduce((a, b) => a + b, 0)
          };
          
          // Afegim el total
          summary.total = Object.values(summary).reduce((a, b) => a + b, 0);

          // Transformem el breakdown al format que necessitem
          const categories = new Set();
          ['quejas', 'orientaciones', 'canalizaciones', 'acompanamientos'].forEach(type => {
            if (breakdownRes.data[type]) {
              Object.keys(breakdownRes.data[type]).forEach(cat => categories.add(cat));
            }
          });

          const breakdownData = Array.from(categories).map(category => ({
            label: category,
            quejas: breakdownRes.data.quejas?.[category] || 0,
            orientaciones: breakdownRes.data.orientaciones?.[category] || 0,
            canalizaciones: breakdownRes.data.canalizaciones?.[category] || 0,
            acompanamientos: breakdownRes.data.acompanamientos?.[category] || 0
          }));

          console.log('📊 Dades processades:', { summary, breakdownData });

          setData({
            summary,
            breakdown: breakdownData
          });
          setError(null);
        } else {
          throw new Error('Format de resposta invàlid');
        }
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        if (isSubscribed) {
          setError(err.response?.data?.message || err.message || 'Error desconocido');
          setData({ summary: null, breakdown: null });
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [mode, asOf, dateRange, dim]);

  return {
    data,
    loading,
    error,
    hasData: Boolean(data?.summary && Array.isArray(data?.breakdown))
  };
}