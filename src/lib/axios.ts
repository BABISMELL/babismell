import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined in environment variables');
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    let errorMessage = "Une erreur est survenue";

    if (!error.response) {
      errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion.";
    } else if (error.response.status === 400) {
      errorMessage = error.response.data.message || "Données invalides";
    } else if (error.response.status === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter.";
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response.status === 404) {
      errorMessage = "Ressource non trouvée";
    } else if (error.response.status === 500) {
      errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
    }

    toast({
      variant: "destructive",
      title: "Erreur",
      description: errorMessage
    });

    return Promise.reject(error);
  }
);

export default api;
