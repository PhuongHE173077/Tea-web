import React from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tab } from '@/hooks/useTabManager';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  className?: string;
}

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onClick, onClose }) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-200 border-r border-border/50",
        "hover:bg-accent/50 hover:text-accent-foreground",
        isActive
          ? "bg-background text-foreground border-b-2 border-b-primary"
          : "bg-muted/30 text-muted-foreground"
      )}
      onClick={onClick}
      title={tab.title}
    >
      <span className="truncate max-w-[150px]">
        {tab.title}
      </span>

      {tab.isClosable && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-destructive/20 hover:text-destructive",
            isActive && "opacity-70"
          )}
          onClick={handleCloseClick}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onNewTab,
  className
}) => {
  return (
    <div className={cn("flex items-center bg-muted/20 border-b border-border", className)}>
      <div className="flex items-center overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onClick={() => onTabClick(tab.id)}
            onClose={() => onTabClose(tab.id)}
          />
        ))}
      </div>


    </div>
  );
};

export default TabBar;
