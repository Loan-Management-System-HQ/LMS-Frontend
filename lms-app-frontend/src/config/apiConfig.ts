// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Authentication
    AUTH: {
      REGISTER: '/api/auth/register/',
      LOGIN: '/api/auth/login/',
      LOGOUT: '/api/auth/logout/',
      PROFILE: '/api/auth/profile/',
      TOKEN_REFRESH: '/api/auth/token/refresh/',
    },
    // Loans
    LOANS: {
      APPLICATIONS: '/api/loans/applications/',
      LOANS: '/api/loans/loans/',
      INSTALLMENTS: '/api/loans/installments/',
      CALCULATOR: '/api/loans/calculator/',
      PAYMENTS: '/api/loans/payments/',
      DASHBOARD: '/api/loans/dashboard/',
    },
    // Documents
    DOCUMENTS: {
      BASE: '/api/documents/documents/',
      UPLOAD: '/api/documents/upload/',
      MY_DOCUMENTS: '/api/documents/my-documents/',
      PENDING: '/api/documents/pending/',
      APPROVED: '/api/documents/approved/',
      STATS: '/api/documents/stats/',
    },
    // Simulations
    SIMULATIONS: {
      BASE: '/api/simulations/simulations/',
    },
  },
};

export default API_CONFIG;
