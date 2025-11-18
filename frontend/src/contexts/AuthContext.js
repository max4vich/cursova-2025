import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockUsers } from "../data/mockData";

const AuthContext = createContext();

const STORAGE_KEY = "techshop:user";
const USERS_KEY = "techshop:users";

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : mockUsers;
    } catch (error) {
      console.error("Failed to parse users", error);
      return mockUsers;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to parse user", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = (email) => {
    const existing = users.find((u) => u.email === email);
    if (!existing) {
      throw new Error("Користувача з таким email не знайдено");
    }
    setUser(existing);
  };

  const register = ({ name, email, phone, address }) => {
    const exists = users.find((u) => u.email === email);
    if (exists) {
      throw new Error("Такий email вже використовується");
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      address,
      role: "customer",
    };
    setUsers([newUser, ...users]);
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

