import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { request, setToken, getToken } from "../api/client";

const AuthContext = createContext();
const STORAGE_KEY = "techshop:user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse stored user", error);
    return null;
  }
};

const persistUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [status, setStatus] = useState("loading");

  const loadProfile = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setStatus("ready");
      return;
    }

    try {
      const profile = await request("/auth/me");
      setUser(profile);
      persistUser(profile);
    } catch (error) {
      console.warn("Failed to fetch profile", error);
      setToken(null);
      setUser(null);
      persistUser(null);
    } finally {
      setStatus("ready");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async ({ email, password }) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    persistUser(data.user);
    return data.user;
  };

  const register = async ({ name, email, password, phone }) => {
    const data = await request("/auth/register", {
      method: "POST",
      body: { name, email, password, phone },
    });
    setToken(data.token);
    setUser(data.user);
    persistUser(data.user);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persistUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading: status !== "ready",
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshProfile: loadProfile,
    }),
    [user, status]
  );

  if (status === "loading") {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

