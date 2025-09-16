import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import useDashboard from '@/hooks/useDashboard'

// Mock data đã được chuyển vào useDashboard hook

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "#2563eb",
  },
  orders: {
    label: "Đơn hàng",
    color: "#60a5fa",
  },
  users: {
    label: "Tổng người dùng",
    color: "#10b981",
  },
  newUsers: {
    label: "Người dùng mới",
    color: "#34d399",
  },
}

export default function Dashboard() {
  const {
    stats,
    revenueData,
    userGrowthData,
    productCategoryData,
    recentOrders,
    isLoadingStats,
    isLoadingCharts,
    isLoadingOrders,
    statsError,
    chartsError,
    ordersError,
    refreshAll,
    updateFilters,
    filters
  } = useDashboard({ period: 'month' })

  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'default'
      case 'processing': return 'secondary'
      case 'shipped': return 'outline'
      case 'pending': return 'destructive'
      case 'confirmed': return 'default'
      default: return 'secondary'
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Đã giao'
      case 'processing': return 'Đang xử lý'
      case 'shipped': return 'Đang giao'
      case 'pending': return 'Chờ xử lý'
      case 'confirmed': return 'Đã xác nhận'
      default: return status
    }
  }

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    updateFilters({ period: period as 'week' | 'month' | 'quarter' | 'year' })
  }

  // Handle refresh
  const handleRefresh = () => {
    refreshAll()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePeriodChange(selectedPeriod === 'month' ? 'week' : 'month')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedPeriod === 'month' ? 'Tháng này' : 'Tuần này'}
          </Button>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={isLoadingStats || isLoadingCharts || isLoadingOrders}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${(isLoadingStats || isLoadingCharts || isLoadingOrders) ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>

        </div>
      </div>

      {/* API Connected Alert - chỉ hiển thị khi có lỗi */}

      {/* Error Alerts */}
      {(statsError || chartsError || ordersError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {statsError || chartsError || ordersError}
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? formatCurrency(stats.totalRevenue) : formatCurrency(0)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {(stats?.revenueGrowth || 0) > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={(stats?.revenueGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats?.revenueGrowth || 0)}%
                  </span>
                  <span className="ml-1">so với tháng trước</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? formatNumber(stats.totalOrders) : formatNumber(0)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {(stats?.ordersGrowth || 0) > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={(stats?.ordersGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats?.ordersGrowth || 0)}%
                  </span>
                  <span className="ml-1">so với tháng trước</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? formatNumber(stats.totalUsers) : formatNumber(0)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {(stats?.usersGrowth || 0) > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={(stats?.usersGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats?.usersGrowth || 0)}%
                  </span>
                  <span className="ml-1">so với tháng trước</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? formatNumber(stats.totalProducts) : formatNumber(0)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {(stats?.productsGrowth || 0) > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={(stats?.productsGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats?.productsGrowth || 0)}%
                  </span>
                  <span className="ml-1">so với tháng trước</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <CardDescription>
              Doanh thu và số lượng đơn hàng theo tháng
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoadingCharts ? (
              <div className="h-[350px] flex items-center justify-center">
                <div className="space-y-4 w-full">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value as number) : formatNumber(value as number),
                        name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                      ]}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.6}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      fill="#60a5fa"
                      opacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Product Categories Pie Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Phân tích sản phẩm</CardTitle>
            <CardDescription>
              Tỷ lệ bán hàng theo danh mục
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCharts ? (
              <div className="h-[350px] flex items-center justify-center">
                <div className="space-y-4 w-full">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-4 w-28 mx-auto" />
                  </div>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`${value}%`, 'Tỷ lệ']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* User Growth Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
            <CardDescription>
              Tổng số người dùng và người dùng mới theo tháng
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoadingCharts ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="space-y-4 w-full">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [
                        formatNumber(value as number),
                        name === 'users' ? 'Tổng người dùng' : 'Người dùng mới'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#34d399"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#34d399', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              5 đơn hàng mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">
                        {formatCurrency(order.amount)}
                      </p>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Section */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <CardDescription>
                Quản lý và theo dõi tất cả đơn hàng trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingOrders ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách khách hàng</CardTitle>
              <CardDescription>
                Thông tin và thống kê về khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Dữ liệu khách hàng sẽ được hiển thị ở đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>
                Quản lý kho hàng và sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Dữ liệu sản phẩm sẽ được hiển thị ở đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
