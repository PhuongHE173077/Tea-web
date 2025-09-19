import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTabContext } from '@/contexts/TabContext';
import { Plus, FileText, ShoppingBag, Users, Settings } from 'lucide-react';

export const TabDemo: React.FC = () => {
  const { createNewTab, tabs, activeTabId } = useTabContext();

  const demoPages = [
    {
      title: 'Sản phẩm mới',
      url: '/products/list',
      icon: ShoppingBag,
      description: 'Quản lý danh sách sản phẩm'
    },
    {
      title: 'Đơn hàng mới',
      url: '/orders',
      icon: FileText,
      description: 'Xem và quản lý đơn hàng'
    },
    {
      title: 'Khách hàng',
      url: '/customers',
      icon: Users,
      description: 'Quản lý thông tin khách hàng'
    },
    {
      title: 'Cài đặt',
      url: '/settings',
      icon: Settings,
      description: 'Cấu hình hệ thống'
    }
  ];

  const handleCreateTab = (title: string, url: string) => {
    createNewTab(title, url, true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Demo Tab System
          </CardTitle>
          <CardDescription>
            Tạo tab mới ngay bên cạnh tab hiện tại và tự động chuyển đến tab đó
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoPages.map((page) => (
              <Card key={page.url} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <page.icon className="h-8 w-8 text-primary" />
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                    <Button
                      size="sm"
                      onClick={() => handleCreateTab(page.title, page.url)}
                      className="w-full"
                    >
                      Tạo Tab
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin Tab hiện tại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Tổng số tabs:</strong> {tabs.length}
            </div>
            <div>
              <strong>Tab đang active:</strong> {activeTabId || 'Không có'}
            </div>
            <div>
              <strong>Danh sách tabs:</strong>
              <ul className="mt-2 space-y-1">
                {tabs.map((tab, index) => (
                  <li key={tab.id} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className={tab.isActive ? 'font-bold text-primary' : ''}>
                      {tab.title}
                    </span>
                    <span className="text-muted-foreground">({tab.url})</span>
                    {!tab.isClosable && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">Không thể đóng</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Click vào các nút "Tạo Tab" ở trên để tạo tab mới</p>
            <p>• Tab mới sẽ được tạo ngay bên cạnh tab hiện tại</p>
            <p>• Hệ thống sẽ tự động chuyển đến tab mới</p>
            <p>• Click vào tab để chuyển đổi giữa các tab</p>
            <p>• Click vào nút X để đóng tab (trừ tab Dashboard chính)</p>
            <p>• Click vào nút + trên thanh tab để tạo tab Dashboard mới</p>
            <p>• Sử dụng menu sidebar để tạo tab cho các trang khác</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabDemo;
