"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type RegisterContextType = {
  step1Data: RegisterData | null;
  setStep1Data: (data: RegisterData) => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [step1Data, setStep1Data] = useState<RegisterData | null>(null);

  return (
    <RegisterContext.Provider value={{ step1Data, setStep1Data }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
};
