import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  isClosable?: boolean;
}

export interface UseTabManagerReturn {
  tabs: Tab[];
  activeTabId: string | null;
  createNewTab: (title: string, url: string, insertAfterCurrent?: boolean) => void;
  closeTab: (tabId: string) => void;
  switchToTab: (tabId: string) => void;
  updateTabTitle: (tabId: string, title: string) => void;
  getActiveTab: () => Tab | null;
  getTabIndex: (tabId: string) => number;
}

export function useTabManager(initialTabs: Tab[] = []): UseTabManagerReturn {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(
    initialTabs.find(tab => tab.isActive)?.id || null
  );
  const navigate = useNavigate();

  const generateTabId = useCallback(() => {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createNewTab = useCallback((title: string, url: string, insertAfterCurrent = true) => {
    const newTabId = generateTabId();
    const newTab: Tab = {
      id: newTabId,
      title,
      url,
      isActive: true,
      isClosable: true
    };

    setTabs(prevTabs => {
      // Deactivate all existing tabs
      const updatedTabs = prevTabs.map(tab => ({ ...tab, isActive: false }));
      
      if (insertAfterCurrent && activeTabId) {
        // Find current active tab index
        const currentIndex = updatedTabs.findIndex(tab => tab.id === activeTabId);
        if (currentIndex !== -1) {
          // Insert new tab after current tab
          updatedTabs.splice(currentIndex + 1, 0, newTab);
          return updatedTabs;
        }
      }
      
      // If no current tab or insertAfterCurrent is false, add to end
      return [...updatedTabs, newTab];
    });

    setActiveTabId(newTabId);
    navigate(url);
  }, [activeTabId, generateTabId, navigate]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tabToClose = prevTabs.find(tab => tab.id === tabId);
      if (!tabToClose || !tabToClose.isClosable) {
        return prevTabs;
      }

      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If closing the active tab, switch to another tab
      if (tabId === activeTabId) {
        const closingIndex = prevTabs.findIndex(tab => tab.id === tabId);
        let newActiveTab: Tab | null = null;
        
        // Try to activate the tab to the right first
        if (closingIndex < filteredTabs.length) {
          newActiveTab = filteredTabs[closingIndex];
        }
        // If no tab to the right, try the tab to the left
        else if (closingIndex > 0) {
          newActiveTab = filteredTabs[closingIndex - 1];
        }
        // If only one tab left, activate it
        else if (filteredTabs.length > 0) {
          newActiveTab = filteredTabs[0];
        }

        if (newActiveTab) {
          newActiveTab.isActive = true;
          setActiveTabId(newActiveTab.id);
          navigate(newActiveTab.url);
        } else {
          setActiveTabId(null);
        }
      }

      return filteredTabs;
    });
  }, [activeTabId, navigate]);

  const switchToTab = useCallback((tabId: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    );
    
    const targetTab = tabs.find(tab => tab.id === tabId);
    if (targetTab) {
      setActiveTabId(tabId);
      navigate(targetTab.url);
    }
  }, [tabs, navigate]);

  const updateTabTitle = useCallback((tabId: string, title: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, title } : tab
      )
    );
  }, []);

  const getActiveTab = useCallback(() => {
    return tabs.find(tab => tab.id === activeTabId) || null;
  }, [tabs, activeTabId]);

  const getTabIndex = useCallback((tabId: string) => {
    return tabs.findIndex(tab => tab.id === tabId);
  }, [tabs]);

  return {
    tabs,
    activeTabId,
    createNewTab,
    closeTab,
    switchToTab,
    updateTabTitle,
    getActiveTab,
    getTabIndex
  };
}
