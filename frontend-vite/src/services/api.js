import axios from 'axios';

const getBaseURL = () => {
  // Produção: Frontend no Vercel, Backend no Railway
  if (process.env.NODE_ENV === 'production' || 
      (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))) {
    // link railway
     return 'https://soura-production.up.railway.app';
  }
  
  // Desenvolvimento local: Proxy do Vite
  return '/backend/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro detalhado na API:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    if (error.response) {
      // Erro do servidor (4xx, 5xx)
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Erro ${error.response.status}: ${error.response.statusText}`;
      throw new Error(message);
    } else if (error.request) {
      // Sem resposta do servidor
      throw new Error('Servidor não está respondendo. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      throw new Error('Erro na configuração da requisição');
    }
  }
);

export const timeCapsuleAPI = {
  async submitCapsule(capsuleData) {
    try {
      console.log('Enviando dados da cápsula:', capsuleData);
      console.log('URL completa:', `${getBaseURL()}/submit_capsule.php`);
      
      const response = await api.post('/submit_capsule.php', capsuleData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar cápsula:', error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      console.log('Verificando saúde da API:', `${getBaseURL()}/health.php`);
      const response = await api.get('/health.php');
      return response.data;
    } catch (error) {
      console.error('Erro no health check:', error);
      throw error;
    }
  }
};

export default api;