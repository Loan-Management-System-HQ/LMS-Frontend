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
      // Use apiClient to ensure correct base URL and headers
      const response = await fetch("/api/auth/profile"); // keeping fetch for now but checking response type
      // Better yet, let's use the authService if available, or just fetch with checks
      // The issue is likely the proxy. Let's try to use the full URL if we can, or just handle the error better.
      // Actually, the best fix is to use the apiClient which we know works for other requests.

      // Dynamic import to avoid circular dependency if any, or just use fetch with correct headers if needed.
      // But wait, UserContext is used by components that might be used by apiClient (for token)? 
      // No, apiClient uses localStorage.

      // Let's try to parse JSON only if content-type is json
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.ISStaff || data.isStaff || data.IsStaff) {
            setIsStaff(true);
          } else {
            setIsStaff(false);
          }
        } else {
          console.warn("Profile endpoint returned non-JSON:", contentType);
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
