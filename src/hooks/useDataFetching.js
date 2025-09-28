import { useState, useEffect, useRef } from 'react';

export function useDataFetching({ mode, asOf, dateRange, dim }) {
  console.group('useDataFetching');
  console.log('Paràmetres rebuts:', { mode, asOf, dateRange, dim });

  const [data, setData] = useState({ summary: null, breakdown: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    console.log('Effect executant-se amb:', { mode, asOf, dateRange, dim });
    
    const loadData = async () => {
      console.log('🔄 Iniciant càrrega de dades');
      
      if (!mountedRef.current) return;
      setLoading(true);
      
      try {
        // Dades de prova
        const mockData = {
          summary: {
            quejas: 25,
            canalizaciones: 15,
            orientaciones: 30,
            acompanamientos: 10,
            total: 80
          },
          breakdown: [
            { 
              label: "Homes", 
              quejas: 15, 
              canalizaciones: 8, 
              orientaciones: 18, 
              acompanamientos: 6 
            },
            { 
              label: "Dones", 
              quejas: 10, 
              canalizaciones: 7, 
              orientaciones: 12, 
              acompanamientos: 4 
            }
          ]
        };

        // Simulem un petit retard
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('✅ Dades carregades:', mockData);
        
        if (mountedRef.current) {
          setData(mockData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error en carregar dades:', err);
        if (mountedRef.current) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadData();
    
    return () => {
      console.log('🧹 Netejant effect');
      mountedRef.current = false;
    };
  }, [mode, asOf, dateRange, dim]);

  console.groupEnd();
  
  const hasData = Boolean(data?.summary && data?.breakdown?.length > 0);
  console.log('Estat actual:', { loading, hasData, error });

  return { data, loading, error, hasData };
}