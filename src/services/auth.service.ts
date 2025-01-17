import api from '@/lib/api';
import { User } from '@/types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      }
      throw new Error('Une erreur est survenue lors de la connexion');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // En mode développement, simuler une réponse API
      const token = 'fake-token-' + Math.random();
      const user = {
        id: 'user-' + Math.random(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Simuler une vérification d'email unique
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.some((u: any) => u.email === data.email)) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Sauvegarder l'utilisateur
      existingUsers.push(user);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      localStorage.setItem('token', token);

      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { token, user };
    } catch (error: any) {
      if (error.message.includes('email')) {
        throw new Error('Cet email est déjà utilisé');
      }
      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  },

  async getProfile(): Promise<{ data: User }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }

    // En mode développement, simuler la récupération du profil
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === token.split('-')[2]);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return { data: user };
  },

  async resetPassword(email: string): Promise<void> {
    // Simuler l'envoi d'email
    console.log('Reset password email sent to:', email);
  },

  async updatePassword(token: string, password: string): Promise<void> {
    // Simuler la mise à jour du mot de passe
    console.log('Password updated for token:', token);
  },

  logout() {
    localStorage.removeItem('token');
  }
};