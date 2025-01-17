import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'CLIENT';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email);

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Dans un environnement de production, vérifier le mot de passe avec bcrypt
      if (password !== user.password) {
        throw new Error('Email ou mot de passe incorrect');
      }

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur BABISMELL"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email);

      if (!user) {
        throw new Error('Aucun compte associé à cet email');
      }

      // Générer un token de réinitialisation
      const resetToken = Math.random().toString(36).substring(2, 15);
      
      // Sauvegarder le token dans localStorage (en production, ceci serait fait côté serveur)
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      resetTokens[email] = {
        token: resetToken,
        expiry: Date.now() + 3600000 // 1 heure
      };
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation a été envoyé à votre adresse"
      });

      // En production, envoyer un vrai email
      console.log('Reset token:', resetToken);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
      throw error;
    }
  };

  const updatePassword = async (token: string, newPassword: string) => {
    try {
      // Vérifier le token
      const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
      const tokenEntry = Object.entries(resetTokens).find(([_, value]: any) => value.token === token);

      if (!tokenEntry || Date.now() > tokenEntry[1].expiry) {
        throw new Error('Token invalide ou expiré');
      }

      const email = tokenEntry[0];

      // Mettre à jour le mot de passe
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: User) => {
        if (u.email === email) {
          return { ...u, password: newPassword };
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Supprimer le token utilisé
      delete resetTokens[email];
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

      toast({
        title: "Mot de passe mis à jour",
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe"
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast({
      title: "Déconnexion",
      description: "À bientôt sur BABISMELL"
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}