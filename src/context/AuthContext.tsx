import { createContext, useState, useEffect, useContext, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto login + smooth initialization
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      }

      // small delay for smoother UI loaders
      setTimeout(() => setLoading(false), 300);
    };

    initAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // Decode JWT to get user info (basic implementation)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userData = {
        id: payload.id || payload._id || "",
        name: payload.name || "",
        email: payload.email || "",
        role: payload.role || "",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* Global loader for modern UX */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Loading your session...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};