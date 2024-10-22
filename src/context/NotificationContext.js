"use client"
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const incrementNewOrdersCount = () => {
    setNewOrdersCount((prevCount) => prevCount + 1);
  };

  return (
    <NotificationContext.Provider
      value={{ newOrdersCount, incrementNewOrdersCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
