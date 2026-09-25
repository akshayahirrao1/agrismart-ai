import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { registerUser, loginUser, getCurrentUser, TOKEN_KEY, AuthUser } from '@/services/api';

export interface Farmer {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  // The backend's User model doesn't have these fields yet, so they're kept
  // client-side only (from the signup form) and are NOT persisted server-side
  // or restored on refresh/other devices. See README/backend/src/models/User.js
  // if you want to add them to the schema for real.
  phone?: string;
  farmName?: string;
  location?: string;
  createdAt?: string;
}

interface AuthContextType {
  farmer: Farmer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  farmName?: string;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local-only profile extras (phone/farmName/location) keyed by email, since
// the backend doesn't store them. Purely cosmetic, not a source of truth.
const PROFILE_EXTRAS_KEY = 'agrismart_profile_extras';

const toFarmer = (user: AuthUser, extras?: Partial<Farmer>): Farmer => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  ...extras,
});

const getProfileExtras = (email: string): Partial<Farmer> => {
  try {
    const all = JSON.parse(localStorage.getItem(PROFILE_EXTRAS_KEY) || '{}');
    return all[email.toLowerCase()] || {};
  } catch {
    return {};
  }
};

const saveProfileExtras = (email: string, extras: Partial<Farmer>) => {
  try {
    const all = JSON.parse(localStorage.getItem(PROFILE_EXTRAS_KEY) || '{}');
    all[email.toLowerCase()] = extras;
    localStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(all));
  } catch {
    // ignore storage errors
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount, if we have a token, validate it against the backend and
    // restore the session. This replaces the old "read from localStorage"
    // approach so the session is always backend-verified.
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const user = await getCurrentUser();
        setFarmer(toFarmer(user, getProfileExtras(user.email)));
      } catch {
        // Token invalid/expired
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, user } = await loginUser({ email, password });
      localStorage.setItem(TOKEN_KEY, token);
      setFarmer(toFarmer(user, getProfileExtras(user.email)));
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      const { token, user } = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem(TOKEN_KEY, token);

      const extras = { phone: data.phone, farmName: data.farmName, location: data.location };
      saveProfileExtras(user.email, extras);
      setFarmer(toFarmer(user, extras));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setFarmer(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{
      farmer,
      isAuthenticated: !!farmer,
      isLoading,
      login,
      signup,
      logout
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