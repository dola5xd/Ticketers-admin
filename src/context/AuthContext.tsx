/* eslint-disable react-refresh/only-export-components */
// authXContext.tsx
import { getSanityClient } from "@/lib/sanity";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface User {
  uid?: string;
  email: string | undefined;
  role: "admin" | "preview" | undefined;
  token?: string; // Only present for admin; will be encoded when stored
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  client: ReturnType<typeof getSanityClient>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user from sessionStorage, decoding token if necessary
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token) {
          parsedUser.token = decodeToken(parsedUser.token);
        }
        return parsedUser;
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    return null;
  });

  // Helper to update both state and sessionStorage
  const setUserAndPersist = (user: User | null) => {
    setUser(user);
    if (user) {
      const userToStore = { ...user };
      if (userToStore.token) {
        userToStore.token = encodeToken(userToStore.token);
      }
      sessionStorage.setItem("user", JSON.stringify(userToStore));
    } else {
      sessionStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUserAndPersist(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = useMemo(() => getSanityClient(), [user]);

  return (
    <AuthContext.Provider
      value={{ user, setUser: setUserAndPersist, logout, client }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Simple Base64 encoding/decoding functions for demonstration purposes.
const encodeToken = (token: string): string => btoa(token);
export const decodeToken = (encodedToken: string): string => atob(encodedToken);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
