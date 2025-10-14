"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/app/models/JwtPayload";

interface UserContextType {
  user: JwtPayload | null | undefined; // 👈 ahora puede ser undefined
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: undefined, // 👈 inicialmente indefinido
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<JwtPayload | null | undefined>(undefined); // 👈

  useEffect(() => {
    if (status === "loading") {
      setUser(undefined); // 👈 aún cargando
      return;
    }

    if (status === "unauthenticated" || !session?.accessToken) {
      setUser(null); // 👈 sin sesión
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(session.accessToken);
      setUser(decoded); // 👈 sesión válida
    } catch (error) {
      console.error("Error decoding token:", error);
      setUser(null);
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, isLoading: status === "loading" }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
