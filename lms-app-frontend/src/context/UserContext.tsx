// src/context/UserContext.tsx
import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserContextType {
  email: string;
  isStaff: boolean;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const UserContext = createContext<UserContextType>({
  email: "",
  isStaff: false,
  setEmail: () => { },
  clearEmail: () => { },
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [email, setEmailState] = useState("");
  const [isStaff, setIsStaff] = useState(false);

  // Persist login in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmailState(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      fetchProfile();
    } else {
      setIsStaff(false);
    }
  }, [email]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      if (response.ok) {
        const data = await response.json();
        // Assuming the API returns the field as ISStaff based on the user description
        // Checking for various casing just in case
        if (data.ISStaff || data.isStaff || data.IsStaff) {
          setIsStaff(true);
        } else {
          setIsStaff(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const setEmail = (email: string) => {
    setEmailState(email);
    localStorage.setItem("email", email);
  };

  const clearEmail = () => {
    setEmailState("");
    setIsStaff(false);
    localStorage.removeItem("email");
  };

  return (
    <UserContext.Provider value={{ email, isStaff, setEmail, clearEmail }}>
      {children}
    </UserContext.Provider>
  );
};
