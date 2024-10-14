"use client"
import { createContext, useContext, useState } from "react";

// Create the LocationContext
const LocationContext = createContext();

// Create a Provider component
export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Create a custom hook to use the LocationContext
export const useLocation = () => useContext(LocationContext);
