import React, { createContext, useContext, useState, useEffect } from 'react';
import { differenceInMinutes } from 'date-fns';
import { MenuItem } from '../data/mockData';

interface PriceContextType {
  getCurrentPrice: (item: MenuItem) => number;
  updatePrices: () => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time price changes

    return () => clearInterval(interval);
  }, []);

  const calculateDepreciatedPrice = (item: MenuItem) => {
    if (!item.priceDepreciation?.enabled) return item.price;

    const startTime = new Date(item.priceDepreciation.startTime);
    const minutesPassed = differenceInMinutes(currentTime, startTime);
    const depreciation = minutesPassed * item.priceDepreciation.ratePerMinute;
    
    const calculatedPrice = item.price - depreciation;
    return Math.max(calculatedPrice, item.priceDepreciation.lowerBound);
  };

  const getCurrentPrice = (item: MenuItem) => {
    return calculateDepreciatedPrice(item);
  };

  const updatePrices = () => {
    setCurrentTime(new Date());
  };

  return (
    <PriceContext.Provider value={{ getCurrentPrice, updatePrices }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};