// utils/context.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextType {
  lat : number,
  setLat: (value: number) => void,
  lon : number,
  setLon: (value: number) => void,
  code: number;
  setCode: (value: number) => void;
  day : number
  setDay : (value: number) => void
}


export const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);

  return (
    <AppContext.Provider value={{ code, setCode, day, setDay,lat, setLat, lon, setLon }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);


  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
