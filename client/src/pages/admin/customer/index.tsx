"use client"

import { getCustomersAPIs } from "@/apis/customer.apis"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import {
    Search,
    Users,
    ShoppingBag,
    DollarSign,
    Calendar,
    Mail,
    Phone,
    MapPin,
    TrendingUp
} from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { 
    Customer, 
    CustomerFilters, 
    CUSTOMER_SORT_OPTIONS, 
    CUSTOMER_SORT_LABELS 
} from "./types"

export default function CustomerManagement() {
    const isMobile = useIsMobile()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalCustomers, setTotalCustomers] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [searchParams, setSearchParams] = useSearchParams()

    // Đọc parameters từ URL hoặc sử dụng giá trị mặc định
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const sortBy = searchParams.get('sort_by') || CUSTOMER_SORT_OPTIONS.TOTAL_SPENT
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const search = searchParams.get('search') || ''

    // Hàm cập nhật URL parameters
    const updateURLParams = (newPage: number, newLimit: number, newSortBy?: string, newSortOrder?: string, newSearch?: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        params.set('limit', newLimit.toString())
        if (newSortBy) params.set('sort_by', newSortBy)
        if (newSortOrder) params.set('sort_order', newSortOrder)
        if (newSearch) {
            params.set('search', newSearch)
        } else {
            params.delete('search')
        }
        setSearchParams(params, { replace: true })
    }

    // Hàm xử lý thay đổi trang
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateURLParams(newPage, limit, sortBy, sortOrder, search)
        }
    }

    // Hàm xử lý thay đổi kích thước trang
    const handleLimitChange = (newLimit: number) => {
        updateURLParams(1, newLimit, sortBy, sortOrder, search)
    }

    // Hàm xử lý thay đổi sắp xếp
    const handleSortChange = (newSortBy: string) => {
        updateURLParams(1, limit, newSortBy, sortOrder, search)
    }

    // Hàm xử lý thay đổi thứ tự sắp xếp
    const handleSortOrderChange = (newSortOrder: string) => {
        updateURLParams(1, limit, sortBy, newSortOrder, search)
    }

    // Hàm xử lý tìm kiếm
    const handleSearch = () => {
        updateURLParams(1, limit, sortBy, sortOrder, searchTerm)
    }

    // Hàm xử lý Enter key trong search
    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // Fetch data khi URL parameters thay đổi
    useEffect(() => {
        const validPage = Math.max(1, page)
        const validLimit = Math.max(1, Math.min(100, limit))

        if (validPage !== page || validLimit !== limit) {
            updateURLParams(validPage, validLimit, sortBy, sortOrder, search)
            return
        }

        setLoading(true)
        setError(null)
        const filters: CustomerFilters = {
            page: validPage,
            limit: validLimit,
            search: search || undefined,
            sort_by: sortBy as any,
            sort_order: sortOrder as any
        }

        getCustomersAPIs(filters)
            .then((res) => {
                if (res.data && res.data.data) {
                    setCustomers(res.data.data)
                    setTotalCustomers(res.data.pagination?.total_customers || 0)
                    setTotalPages(res.data.pagination?.total_pages || 1)

                    if (validPage > res.data.pagination?.total_pages && res.data.pagination?.total_pages > 0) {
                        updateURLParams(res.data.pagination.total_pages, validLimit, sortBy, sortOrder, search)
                    }
                } else {
                    setCustomers([])
                    setTotalCustomers(0)
                    setTotalPages(1)
                }
            })
            .catch((error) => {
                console.error('Error fetching customers:', error)
                const errorMessage = error.response?.data?.message || error.message || "Không thể tải danh sách khách hàng"
                setError(errorMessage)
                setCustomers([])
                setTotalCustomers(0)
                setTotalPages(1)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [page, limit, sortBy, sortOrder, search])

    // Sync search term with URL
    useEffect(() => {
        setSearchTerm(search)
    }, [search])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">👥 Quản lý Khách hàng</h2>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch} variant="outline">
                        Tìm kiếm
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(CUSTOMER_SORT_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Giảm dần</SelectItem>
                            <SelectItem value="asc">Tăng dần</SelectItem>
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
                            <Users className="w-5 h-5" />
                            Danh sách khách hàng ({totalCustomers} khách hàng)
                        </h3>
                    </div>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-gray-50/80">
                                <TableHead className="w-48">Thông tin khách hàng</TableHead>
                                <TableHead className="w-32 text-center">Số đơn hàng</TableHead>
                                <TableHead className="w-32 text-center">Tổng chi tiêu</TableHead>
                                <TableHead className="w-32 text-center">Đơn trung bình</TableHead>
                                <TableHead className="w-32 text-center">Đơn hoàn thành</TableHead>
                                <TableHead className="w-32 text-center">Đơn gần nhất</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: limit }).map((_, index) => (
                                    <TableRow key={`loading-${index}`} className="border-b border-gray-100">
                                        {Array.from({ length: 6 }).map((_, cellIndex) => (
                                            <TableCell key={cellIndex} className="text-center">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-4">
                                            <Users className="w-12 h-12 text-gray-300" />
                                            <div>
                                                <div className="text-gray-500 font-medium">Không có khách hàng nào</div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {search ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow
                                        key={customer._id}
                                        className="hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100"
                                    >
                                        {/* Thông tin khách hàng */}
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="font-semibold text-gray-900">
                                                    {customer.customer_name}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Phone className="w-3 h-3" />
                                                    {customer.customer_phone}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Mail className="w-3 h-3" />
                                                    {customer.customer_email}
                                                </div>
                                                <div className="flex items-start gap-1 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{customer.customer_address}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Số đơn hàng */}
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="font-bold text-lg text-blue-600">
                                                    {customer.total_orders}
                                                </div>
                                                <div className="text-xs text-gray-500">đơn hàng</div>
                                            </div>
                                        </TableCell>

                                        {/* Tổng chi tiêu */}
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="font-bold text-lg text-tea-green">
                                                    {customer.total_spent.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">VND</div>
                                            </div>
                                        </TableCell>

                                        {/* Đơn trung bình */}
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="font-bold text-lg text-purple-600">
                                                    {Math.round(customer.average_order_value).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500">VND</div>
                                            </div>
                                        </TableCell>

                                        {/* Đơn hoàn thành */}
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="font-bold text-lg text-green-600">
                                                    {customer.completed_orders}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {customer.total_orders > 0 
                                                        ? `${Math.round((customer.completed_orders / customer.total_orders) * 100)}%`
                                                        : '0%'
                                                    }
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Đơn gần nhất */}
                                        <TableCell className="text-center">
                                            <div className="text-sm text-gray-600">
                                                {new Date(customer.last_order_date).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(customer.last_order_date).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

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
                    ) : customers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <div className="font-medium">Không có khách hàng nào</div>
                            <div className="text-sm text-gray-400 mt-1">
                                {search ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}
                            </div>
                        </div>
                    ) : (
                        customers.map((customer) => (
                            <motion.div
                                key={customer._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {customer.customer_name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                <Phone className="w-3 h-3" />
                                                {customer.customer_phone}
                                            </div>
                                        </div>
                                        <Badge className="bg-tea-green/10 text-tea-green border-tea-green/20">
                                            {customer.total_orders} đơn hàng
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Mail className="w-3 h-3" />
                                            {customer.customer_email}
                                        </div>
                                        <div className="flex items-start gap-1 text-xs text-gray-500">
                                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{customer.customer_address}</span>
                                        </div>
                                    </div>

                                    {/* Statistics Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-tea-green/5 rounded-lg p-3 text-center">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <DollarSign className="w-4 h-4 text-tea-green" />
                                                <span className="text-xs text-gray-600">Tổng chi tiêu</span>
                                            </div>
                                            <div className="font-bold text-tea-green">
                                                {customer.total_spent.toLocaleString()} VND
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs text-gray-600">Đơn trung bình</span>
                                            </div>
                                            <div className="font-bold text-purple-600">
                                                {Math.round(customer.average_order_value).toLocaleString()} VND
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-green-600">
                                                    {customer.completed_orders}
                                                </div>
                                                <div className="text-xs text-gray-500">Hoàn thành</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-600">
                                                    {customer.total_orders > 0
                                                        ? `${Math.round((customer.completed_orders / customer.total_orders) * 100)}%`
                                                        : '0%'
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500">Tỷ lệ</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                Gần nhất
                                            </div>
                                            <div className="text-sm font-medium text-gray-600">
                                                {new Date(customer.last_order_date).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {customers.length} trên tổng số {totalCustomers} khách hàng
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
        </motion.div>
    )
}
