import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { User, Dealer } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextValue {
  user: User | null;
  dealer: Dealer | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDealer: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  businessName?: string;
  city?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('em_token')
  );
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('em_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then(({ user, dealer }) => {
        setUser(user);
        setDealer(dealer ?? null);
      })
      .catch(() => {
        localStorage.removeItem('em_token');
        localStorage.removeItem('em_user');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem('em_token', data.token);
    localStorage.setItem('em_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setDealer(data.dealer ?? null);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const result = await authService.register(data);
    localStorage.setItem('em_token', result.token);
    localStorage.setItem('em_user', JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    setDealer(result.dealer ?? null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('em_token');
    localStorage.removeItem('em_user');
    setToken(null);
    setUser(null);
    setDealer(null);
  }, []);

  const value: AuthContextValue = {
    user,
    dealer,
    token,
    loading,
    isAuthenticated: !!user,
    isDealer: user?.role === 'dealer',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
