import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { loginApi, registerApi, getProfileApi, type RegisterPayload } from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<User>;
  registerWithData: (data: RegisterPayload) => Promise<User>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore stored credentials on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error loading saved user:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const loginWithCredentials = async (email: string, password: string): Promise<User> => {
    const res = await loginApi({ email, password });
    login(res.token, res.user);
    return res.user;
  };

  const registerWithData = async (data: RegisterPayload): Promise<User> => {
    const res = await registerApi(data);
    login(res.token, res.user);
    return res.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await getProfileApi();
      if (res?.user) {
        updateUser(res.user);
      }
    } catch (err) {
      console.warn("Failed to refresh user profile", err);
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithCredentials,
        registerWithData,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!token,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};