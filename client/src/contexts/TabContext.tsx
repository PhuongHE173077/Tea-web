import React, { createContext, useContext, ReactNode } from 'react';
import { useTabManager, Tab, UseTabManagerReturn } from '@/hooks/useTabManager';

interface TabContextType extends UseTabManagerReturn {
  // Additional context-specific methods can be added here
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
  initialTabs?: Tab[];
}

export const TabProvider: React.FC<TabProviderProps> = ({ children, initialTabs = [] }) => {
  const tabManager = useTabManager(initialTabs);

  return (
    <TabContext.Provider value={tabManager}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = (): TabContextType => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

export default TabContext;
