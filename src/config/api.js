export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
  ENDPOINTS: {
    SUMMARY: '/api/doq/public/summary',
    SUMMARY_PERIOD: '/api/doq/public/summary-period',
    BREAKDOWN: '/api/doq/public/breakdown'
  }
};