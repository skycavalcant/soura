import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Erro no servidor');
    } else if (error.request) {
      throw new Error('Sem conexão com o servidor');
    } else {
      throw new Error('Erro na requisição');
    }
  }
);

export const timeCapsuleAPI = {
  async submitCapsule(capsuleData) {
    try {
      console.log('Enviando dados da cápsula:', capsuleData);
      const response = await api.post('/submit_capsule.php', capsuleData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar cápsula:', error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      const response = await api.get('/health.php');
      return response.data;
    } catch (error) {
      console.error('Erro no health check:', error);
      throw error;
    }
  }
};

export default api;