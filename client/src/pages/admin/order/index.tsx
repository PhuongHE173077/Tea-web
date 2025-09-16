"use client"

import { getAllOrdersAPIs, updateOrderStatusAPIs } from "@/apis/order.apis"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import {
    Eye,
    Package,
    ShoppingBag,
    User,
    MapPin,
    CreditCard,
    Calendar,
    Truck
} from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { 
    Order, 
    OrderFilters, 
    ORDER_STATUS_LABELS, 
    ORDER_STATUS_COLORS,
    PAYMENT_METHOD_LABELS,
    PAYMENT_STATUS_COLORS,
    ORDER_STATUS
} from "./types"

export default function OrderManagement() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [searchParams, setSearchParams] = useSearchParams()

    // Đọc parameters từ URL hoặc sử dụng giá trị mặc định
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status') || ''

    // Hàm cập nhật URL parameters
    const updateURLParams = (newPage: number, newLimit: number, newStatus?: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        params.set('limit', newLimit.toString())
        if (newStatus) {
            params.set('status', newStatus)
        } else {
            params.delete('status')
        }
        setSearchParams(params, { replace: true })
    }

    // Hàm xử lý thay đổi trang
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateURLParams(newPage, limit, status)
        }
    }

    // Hàm xử lý thay đổi kích thước trang
    const handleLimitChange = (newLimit: number) => {
        updateURLParams(1, newLimit, status)
    }

    // Hàm xử lý thay đổi trạng thái filter
    const handleStatusChange = (newStatus: string) => {
        updateURLParams(1, limit, newStatus === 'all' ? '' : newStatus)
    }

    // Fetch data khi URL parameters thay đổi
    useEffect(() => {
        const validPage = Math.max(1, page)
        const validLimit = Math.max(1, Math.min(100, limit))

        if (validPage !== page || validLimit !== limit) {
            updateURLParams(validPage, validLimit, status)
            return
        }

        setLoading(true)
        setError(null)
        const filters: OrderFilters = {
            page: validPage,
            limit: validLimit,
            status: status || undefined,
            sort_by: 'createdAt',
            sort_order: 'desc'
        }

        getAllOrdersAPIs(filters)
            .then((res) => {


                // Xử lý dữ liệu response có thể có cấu trúc khác nhau
                let ordersData = []
                let totalItems = 0
                let totalPages = 1

                if (res.data) {
                    // Nếu response có cấu trúc { data: [...], pagination: {...} }
                    if (res.data.data && Array.isArray(res.data.data)) {
                        ordersData = res.data.data
                        totalItems = res.data.pagination?.total_orders || res.data.data.length
                        totalPages = res.data.pagination?.total_pages || 1
                    }
                    // Nếu response trực tiếp là array
                    else if (Array.isArray(res.data)) {
                        ordersData = res.data
                        totalItems = res.data.length
                        totalPages = Math.ceil(totalItems / validLimit)
                    }
                    // Nếu có total và data ở level khác
                    else if (res.data.orders && Array.isArray(res.data.orders)) {
                        ordersData = res.data.orders
                        totalItems = res.data.total || res.data.orders.length
                        totalPages = Math.ceil(totalItems / validLimit)
                    }
                }



                setOrders(ordersData)
                setTotalOrders(totalItems)
                setTotalPages(totalPages)

                if (validPage > totalPages && totalPages > 0) {
                    updateURLParams(totalPages, validLimit, status)
                }
            })
            .catch((error) => {
                console.error('Error fetching orders:', error)
                console.error('Error details:', error.response?.data || error.message)

                // Hiển thị thông báo lỗi chi tiết hơn
                const errorMessage = error.response?.data?.message || error.message || "Không thể tải danh sách đơn hàng"
                setError(errorMessage)

                // Set empty data để tránh crash
                setOrders([])
                setTotalOrders(0)
                setTotalPages(1)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [page, limit, status])

    const handleView = (order: Order) => {
        setSelectedOrder(order)
        setOpen(true)
    }

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatusAPIs(orderId, newStatus)

            // Cập nhật state local
            setOrders(prev => prev.map(order =>
                order._id === orderId
                    ? { ...order, order_status: newStatus as any }
                    : order
            ))

            // Cập nhật selectedOrder nếu đang xem modal
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus as any } : null)
            }

            Swal.fire({
                title: "Thành công!",
                text: "Cập nhật trạng thái đơn hàng thành công",
                icon: "success",
                timer: 2000
            })
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Không thể cập nhật trạng thái đơn hàng"

            Swal.fire({
                title: "Lỗi!",
                text: errorMessage,
                icon: "error"
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">🛒 Quản lý Đơn hàng</h2>
                <div className="flex items-center gap-4">
                    <Select value={status || 'all'} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value={ORDER_STATUS.PENDING}>Chờ xác nhận</SelectItem>
                            <SelectItem value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</SelectItem>
                            <SelectItem value={ORDER_STATUS.PROCESSING}>Đang xử lý</SelectItem>
                            <SelectItem value={ORDER_STATUS.SHIPPED}>Đã gửi hàng</SelectItem>
                            <SelectItem value={ORDER_STATUS.DELIVERED}>Đã giao</SelectItem>
                            <SelectItem value={ORDER_STATUS.CANCELLED}>Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-800">
                        <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center">
                            <span className="text-xs font-bold">!</span>
                        </div>
                        <div>
                            <h4 className="font-semibold">Lỗi tải dữ liệu</h4>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-3"
                        onClick={() => {
                            setError(null)
                            // Trigger reload
                            const params = new URLSearchParams(searchParams)
                            setSearchParams(params, { replace: true })
                        }}
                    >
                        Thử lại
                    </Button>
                </div>
            )}

            {/* Desktop: Table */}
            {!isMobile && (
                <div className="bg-white border rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-tea-green to-tea-green-light p-4">
                        <h3 className="text-black font-semibold flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Danh sách đơn hàng ({totalOrders} đơn hàng)
                        </h3>
                    </div>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-gray-50/80">
                                <TableHead className="w-28">Mã đơn hàng</TableHead>
                                <TableHead className="w-44">Khách hàng</TableHead>
                                <TableHead className="w-52">Sản phẩm</TableHead>
                                <TableHead className="w-24 text-center">Tổng tiền</TableHead>
                                <TableHead className="w-20 text-center">T.Toán</TableHead>
                                <TableHead className="w-32 text-center">Trạng thái</TableHead>
                                <TableHead className="w-24 text-center">Ngày đặt</TableHead>
                                <TableHead className="w-20 text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: limit }).map((_, index) => (
                                    <TableRow key={`loading-${index}`} className="border-b border-gray-100">
                                        {Array.from({ length: 8 }).map((_, cellIndex) => (
                                            <TableCell key={cellIndex} className="text-center">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                                            <div>
                                                <div className="text-gray-500 font-medium">Không có đơn hàng nào</div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {status ? 'Không có đơn hàng nào với trạng thái này' : 'Chưa có đơn hàng nào được tạo'}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow
                                        key={order._id}
                                        className="hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100"
                                    >
                                        {/* Mã đơn hàng */}
                                        <TableCell>
                                            <div className="font-semibold text-tea-green text-sm">
                                                #{order.order_trackingNumber}
                                            </div>
                                        </TableCell>

                                        {/* Thông tin khách hàng */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium text-sm">
                                                    {order.order_customer?.name || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {order.order_customer?.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Sản phẩm */}
                                        <TableCell className="min-w-[280px]">
                                            <div className="space-y-1">
                                                {order.order_products?.slice(0, 2).map((item, index) => (
                                                    <div key={index} className="text-sm">
                                                        <div className="font-medium">
                                                            {item?.product_name || 'N/A'}
                                                            {item?.product_attribute && (
                                                                <span className="text-gray-600 font-normal">
                                                                    {' '}{item.product_attribute.name === "package" ? `túi ${item.product_attribute.unit}` : "hộp"}
                                                                </span>
                                                            )}
                                                            <span className="text-gray-600 font-normal"> x{item?.quantity || 0}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(order.order_products?.length || 0) > 2 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{(order.order_products?.length || 0) - 2} sản phẩm khác
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Tổng tiền */}
                                        <TableCell className="text-center">
                                            <div className="font-bold text-lg text-tea-green">
                                                {order.order_checkout?.total?.toLocaleString() || '0'}
                                            </div>
                                            <div className="text-xs text-gray-500">VND</div>
                                        </TableCell>

                                        {/* Thanh toán */}
                                        <TableCell className="text-center">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    {order.order_payment?.method ? PAYMENT_METHOD_LABELS[order.order_payment.method as keyof typeof PAYMENT_METHOD_LABELS] || order.order_payment.method : 'N/A'}
                                                </div>
                                                <Badge className={order.order_payment?.status ? PAYMENT_STATUS_COLORS[order.order_payment.status as keyof typeof PAYMENT_STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                                                    {order.order_payment?.status || 'N/A'}
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        {/* Trạng thái */}
                                        <TableCell className="text-center min-w-[160px]">
                                            <Select
                                                value={order.order_status || ORDER_STATUS.PENDING}
                                                onValueChange={(value) => handleStatusUpdate(order._id, value)}
                                            >
                                                <SelectTrigger className="w-full min-w-[150px]">
                                                    <SelectValue>
                                                        <Badge className={`${order.order_status ? ORDER_STATUS_COLORS[order.order_status as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-100 text-gray-800 border-gray-200'} px-2 py-1 text-xs whitespace-nowrap`}>
                                                            {order.order_status ? ORDER_STATUS_LABELS[order.order_status as keyof typeof ORDER_STATUS_LABELS] || order.order_status : 'N/A'}
                                                        </Badge>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={ORDER_STATUS.PENDING}>Chờ xác nhận</SelectItem>
                                                    <SelectItem value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</SelectItem>
                                                    <SelectItem value={ORDER_STATUS.PROCESSING}>Đang xử lý</SelectItem>
                                                    <SelectItem value={ORDER_STATUS.SHIPPED}>Đã gửi hàng</SelectItem>
                                                    <SelectItem value={ORDER_STATUS.DELIVERED}>Đã giao</SelectItem>
                                                    <SelectItem value={ORDER_STATUS.CANCELLED}>Đã hủy</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>

                                        {/* Ngày đặt */}
                                        <TableCell className="text-center">
                                            <div className="text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </TableCell>

                                        {/* Hành động */}
                                        <TableCell className="text-center">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                                                            onClick={() => handleView(order)}
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Xem chi tiết</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {orders.length} trên tổng số {totalOrders} đơn hàng
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Hiển thị:</span>
                        <Select value={limit.toString()} onValueChange={(value) => handleLimitChange(parseInt(value, 10))}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">mục/trang</span>
                    </div>
                </div>

                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(page - 1)}
                                    className={page === 1 ? "pointer-events-none opacity-50" : "hover:bg-tea-green/10"}
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={page === pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={page === pageNum
                                                ? "bg-tea-green text-white hover:bg-tea-green/90"
                                                : "hover:bg-tea-green/10"
                                            }
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {totalPages > 5 && <PaginationEllipsis />}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(page + 1)}
                                    className={page === totalPages ? "pointer-events-none opacity-50" : "hover:bg-tea-green/10"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>

            {/* Mobile: Card List */}
            {isMobile && (
                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: limit }).map((_, index) => (
                            <div key={`loading-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Không có đơn hàng nào
                        </div>
                    ) : (
                        orders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-tea-green text-lg">
                                                #{order.order_trackingNumber || 'N/A'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                            </p>
                                        </div>
                                        <Badge className={`${order.order_status ? ORDER_STATUS_COLORS[order.order_status as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-100 text-gray-800 border-gray-200'} px-3 py-1 text-xs whitespace-nowrap`}>
                                            {order.order_status ? ORDER_STATUS_LABELS[order.order_status as keyof typeof ORDER_STATUS_LABELS] || order.order_status : 'N/A'}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{order.order_customer?.name || 'N/A'}</span>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                                            <div className="flex-1">
                                                {order.order_products?.slice(0, 1).map((item, index) => (
                                                    <div key={index} className="text-sm">
                                                        <span className="font-medium">{item?.product_name || 'N/A'}</span>
                                                        {item?.product_attribute && (
                                                            <span className="text-gray-600">
                                                                {' '}{item.product_attribute.name === "package" ? `túi ${item.product_attribute.unit}` : "hộp"}
                                                            </span>
                                                        )}
                                                        <span className="text-gray-600"> x{item?.quantity || 0}</span>
                                                    </div>
                                                ))}
                                                {(order.order_products?.length || 0) > 1 && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        +{(order.order_products?.length || 0) - 1} sản phẩm khác
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{order.order_payment?.method ? PAYMENT_METHOD_LABELS[order.order_payment.method as keyof typeof PAYMENT_METHOD_LABELS] || order.order_payment.method : 'N/A'}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="text-lg font-bold text-tea-green">
                                                {order.order_checkout?.total?.toLocaleString() || '0'} VND
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleView(order)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6 text-tea-green" />
                            Chi tiết đơn hàng #{selectedOrder?.order_trackingNumber}
                        </DialogTitle>
                        <div className="flex items-center gap-4 mt-2">
                            <Badge className={`${selectedOrder ? ORDER_STATUS_COLORS[selectedOrder.order_status] : ''} px-3 py-1 text-sm whitespace-nowrap`}>
                                {selectedOrder ? ORDER_STATUS_LABELS[selectedOrder.order_status] : ''}
                            </Badge>
                            <div className="text-sm text-gray-500">
                                Ngày đặt: {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedOrder ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cột 1: Thông tin khách hàng và địa chỉ */}
                            <div className="space-y-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Thông tin khách hàng
                                        </h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm text-gray-600">Tên:</span>
                                                <div className="font-medium">{selectedOrder.order_customer?.name || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Số điện thoại:</span>
                                                <div className="font-medium">{selectedOrder.order_customer?.phone || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Email:</span>
                                                <div className="font-medium">{selectedOrder.order_customer?.email || 'N/A'}</div>
                                            </div>
                                            {selectedOrder.order_customer?.note && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Ghi chú:</span>
                                                    <div className="font-medium">{selectedOrder.order_customer.note}</div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Địa chỉ giao hàng
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <div className="font-medium">{selectedOrder.order_shipping?.full_address || 'N/A'}</div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {selectedOrder.order_shipping?.ward?.name || 'N/A'}, {selectedOrder.order_shipping?.district?.name || 'N/A'}, {selectedOrder.order_shipping?.province?.name || 'N/A'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Thanh toán
                                        </h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm text-gray-600">Phương thức:</span>
                                                <div className="font-medium">
                                                    {selectedOrder.order_payment?.method
                                                        ? PAYMENT_METHOD_LABELS[selectedOrder.order_payment.method as keyof typeof PAYMENT_METHOD_LABELS] || selectedOrder.order_payment.method
                                                        : 'N/A'
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                                <div className="mt-1">
                                                    <Badge className={selectedOrder.order_payment?.status
                                                        ? PAYMENT_STATUS_COLORS[selectedOrder.order_payment.status as keyof typeof PAYMENT_STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200'
                                                        : 'bg-gray-100 text-gray-800 border-gray-200'
                                                    }>
                                                        {selectedOrder.order_payment?.status || 'N/A'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Cột 2-3: Sản phẩm và tổng kết */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            Sản phẩm đã đặt ({selectedOrder.order_products?.length || 0} sản phẩm)
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedOrder.order_products && selectedOrder.order_products.length > 0 ? (
                                                selectedOrder.order_products.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                        <img
                                                            src={item?.product_image || '/placeholder-image.jpg'}
                                                            alt={item?.product_name || 'Sản phẩm'}
                                                            className="w-16 h-16 rounded-lg border object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <h5 className="font-medium">{item?.product_name || 'N/A'}</h5>
                                                            {item?.product_attribute && (
                                                                <p className="text-sm text-gray-600">
                                                                    {item.product_attribute.name === "package" ? `Túi ${item.product_attribute.unit}` : "Hộp"}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-sm text-gray-600">
                                                                    {(item?.product_price || 0).toLocaleString()} VND x {item?.quantity || 0}
                                                                </span>
                                                                <span className="font-bold text-tea-green">
                                                                    {(item?.total_price || 0).toLocaleString()} VND
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    Không có sản phẩm nào
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3">Tổng kết đơn hàng</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Tạm tính:</span>
                                                <span>{(selectedOrder.order_checkout?.subtotal || 0).toLocaleString()} VND</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Phí vận chuyển:</span>
                                                <span>{(selectedOrder.order_checkout?.shipping_fee || 0).toLocaleString()} VND</span>
                                            </div>
                                            {(selectedOrder.order_checkout?.discount_amount || 0) > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Giảm giá:</span>
                                                    <span>-{(selectedOrder.order_checkout?.discount_amount || 0).toLocaleString()} VND</span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2 flex justify-between text-lg font-bold text-tea-green">
                                                <span>Tổng cộng:</span>
                                                <span>{(selectedOrder.order_checkout?.total || 0).toLocaleString()} VND</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Cập nhật trạng thái */}
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Truck className="w-4 h-4" />
                                            Cập nhật trạng thái đơn hàng
                                        </h4>
                                        <Select
                                            value={selectedOrder.order_status}
                                            onValueChange={(value) => {
                                                handleStatusUpdate(selectedOrder._id, value)
                                                setSelectedOrder(prev => prev ? { ...prev, order_status: value as any } : null)
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ORDER_STATUS.PENDING}>Chờ xác nhận</SelectItem>
                                                <SelectItem value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</SelectItem>
                                                <SelectItem value={ORDER_STATUS.PROCESSING}>Đang xử lý</SelectItem>
                                                <SelectItem value={ORDER_STATUS.SHIPPED}>Đã gửi hàng</SelectItem>
                                                <SelectItem value={ORDER_STATUS.DELIVERED}>Đã giao</SelectItem>
                                                <SelectItem value={ORDER_STATUS.CANCELLED}>Đã hủy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-500">Không có dữ liệu đơn hàng để hiển thị</div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
