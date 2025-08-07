// src/store/PersistorContext.tsx
import { createContext, useContext } from 'react';
import type { Persistor } from 'redux-persist';

export const PersistorContext = createContext<Persistor | null>(null);

export const usePersistor = () => {
  const context = useContext(PersistorContext);
  if (!context) {
    throw new Error('usePersistor must be used within PersistorProvider');
  }
  return context;
};
