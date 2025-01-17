import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Désactivé pour éviter les problèmes CORS
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);

    if (error.code === 'ERR_NETWORK') {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard."
      });
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      toast({
        variant: "destructive",
        title: "Session expirée",
        description: "Veuillez vous reconnecter"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue lors de la communication avec le serveur"
      });
    }
    return Promise.reject(error);
  }
);

export default api;