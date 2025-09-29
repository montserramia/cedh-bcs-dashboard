import { useState, useEffect } from 'react';
import axios from 'axios';

export function useHistoricDataFetching({ dateRange }) {
  const [data, setData] = useState({ 
    cards: null,
    pipeline_quejas: null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      try {
        setLoading(true);
        
        const baseUrl = import.meta.env.VITE_API_BASE;
        const summaryUrl = `${baseUrl}/api/doq/public/summary-period?start=${dateRange.start}&end=${dateRange.end}`;
        
        console.log('📡 Carregant dades històriques:', summaryUrl);
        
        const response = await axios.get(summaryUrl);

        if (!isSubscribed) return;

        if (response.data) {
          setData({
            cards: response.data.cards,
            pipeline_quejas: response.data.pipeline_quejas
          });
          setError(null);
        } else {
          throw new Error('Format de resposta invàlid');
        }
      } catch (err) {
        console.error('❌ Error carregant dades:', err);
        if (isSubscribed) {
          setError(err.response?.data?.message || err.message || 'Error desconegut');
          setData({ cards: null, pipeline_quejas: null });
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
  }, [dateRange.start, dateRange.end]);

  return {
    data,
    loading,
    error,
    hasData: Boolean(data.cards && data.pipeline_quejas)
  };
}