// src/context/UserContext.tsx
import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserContextType {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const UserContext = createContext<UserContextType>({
  email: "",
  setEmail: () => { },
  clearEmail: () => { },
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [email, setEmailState] = useState("");

  // Persist login in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmailState(storedEmail);
  }, []);

  const setEmail = (email: string) => {
    setEmailState(email);
    localStorage.setItem("email", email);
  };

  const clearEmail = () => {
    setEmailState("");
    localStorage.removeItem("email");
  };

  return (
    <UserContext.Provider value={{ email, setEmail, clearEmail }}>
      {children}
    </UserContext.Provider>
  );
};
