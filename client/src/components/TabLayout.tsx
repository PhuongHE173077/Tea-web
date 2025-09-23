import React from 'react';
import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useTabContext } from '@/contexts/TabContext';

interface TabLayoutProps {
  className?: string;
}

export const TabLayout: React.FC<TabLayoutProps> = ({ className }) => {
  const {
    tabs,
    activeTabId,
    switchToTab,
    closeTab,
    createNewTab
  } = useTabContext();

  const handleNewTab = () => {
    // Tạo tab mới với trang dashboard mặc định
    createNewTab('Dashboard Mới', '/dashboard', true);
  };

  return (
    <div className={className}>
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={switchToTab}
        onTabClose={closeTab}
        onNewTab={handleNewTab}
      />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TabLayout;
