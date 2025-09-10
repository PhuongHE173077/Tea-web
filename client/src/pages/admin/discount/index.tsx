"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { toast } from "react-toastify"
import AddDiscountDialog from "./components/AddDiscountDialog"
import UpdateDiscountDialog from "./components/UpdateDiscountDialog"
import DiscountTable from "./components/DiscountTable"
import {
    fetchDiscountsAPIs,
    createDiscountAPIs,
    updateDiscountAPIs,
    deleteDiscountAPIs,
    toggleDiscountStatusAPIs
} from "@/apis/discount.apis"

export default function DiscountManagement() {
    const isMobile = useIsMobile()
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([])
    const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null)
    const [openAdd, setOpenAdd] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 10

    useEffect(() => {
        fetchDiscounts()
    }, [currentPage])

    useEffect(() => {
        applyFilters()
    }, [discounts, searchTerm, statusFilter, typeFilter])

    const fetchDiscounts = async () => {
        setIsLoading(true)
        try {
            const filters: DiscountFilters = {
                page: currentPage,
                limit: itemsPerPage,
                sort_by: 'createdAt',
                sort_order: 'desc'
            }

            const response = await fetchDiscountsAPIs(filters)
            setDiscounts(response.data.data || [])
            setTotalPages(response.data.pagination?.total_pages || 1)
            setTotalItems(response.data.pagination?.total_items || 0)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tải danh sách mã giảm giá")
            setDiscounts([])
        } finally {
            setIsLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...discounts]

        // Search filter
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase()
            filtered = filtered.filter(discount =>
                discount.code.toLowerCase().includes(search) ||
                discount.name.toLowerCase().includes(search) ||
                discount.description.toLowerCase().includes(search)
            )
        }

        // Status filter
        if (statusFilter !== "all") {
            const now = new Date()
            filtered = filtered.filter(discount => {
                switch (statusFilter) {
                    case "active":
                        return discount.is_active &&
                            new Date(discount.start_date) <= now &&
                            new Date(discount.end_date) >= now &&
                            discount.used_count < discount.usage_limit
                    case "inactive":
                        return !discount.is_active
                    case "expired":
                        return new Date(discount.end_date) < now
                    case "used_up":
                        return discount.used_count >= discount.usage_limit
                    default:
                        return true
                }
            })
        }

        // Type filter
        if (typeFilter !== "all") {
            filtered = filtered.filter(discount => discount.discount_type === typeFilter)
        }

        setFilteredDiscounts(filtered)
    }

    const handleAddDiscount = async (discountData: DiscountFormData) => {
        try {
            const response = await createDiscountAPIs(discountData)
            setDiscounts(prev => [response.data.data, ...prev])
            toast.success("Tạo mã giảm giá thành công!")
            setOpenAdd(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo mã giảm giá")
            throw error
        }
    }

    const handleUpdateDiscount = async (updatedDiscount: Discount) => {
        try {
            const { _id, createdAt, updatedAt, users_used, used_count, created_by, ...updateData } = updatedDiscount
            const response = await updateDiscountAPIs(_id, updateData)
            setDiscounts(prev => prev.map(discount =>
                discount._id === _id ? response.data.data : discount
            ))
            toast.success("Cập nhật mã giảm giá thành công!")
            setOpenUpdate(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật mã giảm giá")
            throw error
        }
    }

    const handleDeleteDiscount = async (discountId: string) => {
        try {
            await deleteDiscountAPIs(discountId)
            setDiscounts(prev => prev.filter(discount => discount._id !== discountId))
            toast.success("Xóa mã giảm giá thành công!")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa mã giảm giá")
        }
    }

    const handleToggleStatus = async (discountId: string, isActive: boolean) => {
        try {
            await toggleDiscountStatusAPIs(discountId, isActive)
            setDiscounts(prev => prev.map(discount =>
                discount._id === discountId ? { ...discount, is_active: isActive } : discount
            ))
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thay đổi trạng thái")
            throw error
        }
    }

    const handleEditDiscount = (discount: Discount) => {
        setActiveDiscount(discount)
        setOpenUpdate(true)
    }

    const resetFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setTypeFilter("all")
    }

    if (isMobile) {
        return (
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Quản lý mã giảm giá</h1>
                        <p className="text-muted-foreground text-sm">Quản lý các mã giảm giá của cửa hàng</p>
                    </div>
                    <Button onClick={() => setOpenAdd(true)} className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm
                    </Button>
                </div>

                {/* Mobile Filters */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm mã giảm giá..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="active">Đang hoạt động</SelectItem>
                                <SelectItem value="inactive">Không hoạt động</SelectItem>
                                <SelectItem value="expired">Đã hết hạn</SelectItem>
                                <SelectItem value="used_up">Đã hết lượt</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả loại</SelectItem>
                                <SelectItem value="percentage">Phần trăm</SelectItem>
                                <SelectItem value="fixed_amount">Cố định</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Đang tải...</p>
                        </div>
                    ) : filteredDiscounts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Không có mã giảm giá nào</p>
                        </div>
                    ) : (
                        filteredDiscounts.map((discount) => (
                            <Card key={discount._id} className="rounded-2xl shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center text-lg">
                                        <span className="font-mono">{discount.code}</span>
                                        <Badge variant={discount.is_active ? "default" : "secondary"}>
                                            {discount.is_active ? "Hoạt động" : "Không hoạt động"}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <p className="font-medium">{discount.name}</p>
                                    <p className="text-muted-foreground line-clamp-2">{discount.description}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="font-medium">Loại:</span> {discount.discount_type === "percentage" ? "Phần trăm" : "Cố định"}
                                        </div>
                                        <div>
                                            <span className="font-medium">Giá trị:</span> {discount.discount_type === "percentage" ? `${discount.discount_value}%` : `${discount.discount_value.toLocaleString()}đ`}
                                        </div>
                                        <div>
                                            <span className="font-medium">Sử dụng:</span> {discount.used_count}/{discount.usage_limit}
                                        </div>
                                        <div>
                                            <span className="font-medium">Hết hạn:</span> {new Date(discount.end_date).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button size="sm" onClick={() => handleEditDiscount(discount)} className="rounded-xl">
                                            Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="rounded-xl"
                                            onClick={() => handleDeleteDiscount(discount._id)}
                                            disabled={discount.used_count > 0}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Dialogs */}
                {openAdd && (
                    <AddDiscountDialog
                        open={openAdd}
                        setOpen={setOpenAdd}
                        onAdd={handleAddDiscount}
                    />
                )}
                {openUpdate && activeDiscount && (
                    <UpdateDiscountDialog
                        open={openUpdate}
                        setOpen={setOpenUpdate}
                        discount={activeDiscount}
                        onUpdate={handleUpdateDiscount}
                    />
                )}
            </div>
        )
    }

    // Desktop view
    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý mã giảm giá</h1>
                    <p className="text-muted-foreground">Quản lý các mã giảm giá của cửa hàng</p>
                </div>
                <Button onClick={() => setOpenAdd(true)} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo mã giảm giá
                </Button>
            </div>

            {/* Desktop Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm mã giảm giá..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-80"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang hoạt động</SelectItem>
                            <SelectItem value="inactive">Không hoạt động</SelectItem>
                            <SelectItem value="expired">Đã hết hạn</SelectItem>
                            <SelectItem value="used_up">Đã hết lượt</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Loại giảm giá" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="percentage">Phần trăm</SelectItem>
                            <SelectItem value="fixed_amount">Cố định</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={resetFilters} className="rounded-xl">
                        Đặt lại bộ lọc
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Hiển thị {filteredDiscounts.length} / {totalItems} mã giảm giá
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <DiscountTable
                discounts={filteredDiscounts}
                onEdit={handleEditDiscount}
                onDelete={handleDeleteDiscount}
                onToggleStatus={handleToggleStatus}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="rounded-xl"
                    >
                        Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-xl"
                    >
                        Sau
                    </Button>
                </div>
            )}

            {/* Dialogs */}
            {openAdd && (
                <AddDiscountDialog
                    open={openAdd}
                    setOpen={setOpenAdd}
                    onAdd={handleAddDiscount}
                />
            )}
            {openUpdate && activeDiscount && (
                <UpdateDiscountDialog
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    discount={activeDiscount}
                    onUpdate={handleUpdateDiscount}
                />
            )}
        </div>
    )
}
