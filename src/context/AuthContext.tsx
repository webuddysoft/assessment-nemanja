"use client";

import { createContext, useContext, useEffect, useState } from "react";
import API from "@/api/api";
import { getAuthHeader } from "@/utils/auth";

export interface User {
  username?: string;
  email?: string;
  nickname?: string;
  aboutMe?: string;
  [key: string]: unknown; // optional fallback
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user_id);
      if (res) {
        const userData = await API.get(`/users/${res.data.user_id}`, {
            headers: { Authorization: `Bearer ${res.data.access_token}` },
          });
          setUser(userData.data);
      }
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    if (token && userId) {
      API.get(`/users/${userId}`, getAuthHeader())
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          setUser(null);
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
