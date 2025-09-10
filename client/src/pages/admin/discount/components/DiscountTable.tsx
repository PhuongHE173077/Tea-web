"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "react-toastify"

interface DiscountTableProps {
    discounts: Discount[]
    onEdit: (discount: Discount) => void
    onDelete: (discountId: string) => void
    onToggleStatus: (discountId: string, isActive: boolean) => void
    isLoading?: boolean
}

export default function DiscountTable({ 
    discounts, 
    onEdit, 
    onDelete, 
    onToggleStatus, 
    isLoading = false 
}: DiscountTableProps) {
    const [toggleLoading, setToggleLoading] = useState<string | null>(null)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDiscountValue = (discount: Discount) => {
        if (discount.discount_type === "percentage") {
            return `${discount.discount_value}%`
        }
        return formatCurrency(discount.discount_value)
    }

    const getDiscountStatus = (discount: Discount) => {
        const now = new Date()
        const startDate = new Date(discount.start_date)
        const endDate = new Date(discount.end_date)

        if (!discount.is_active) {
            return { label: "Không hoạt động", variant: "secondary" as const }
        }
        
        if (now < startDate) {
            return { label: "Chưa bắt đầu", variant: "outline" as const }
        }
        
        if (now > endDate) {
            return { label: "Đã hết hạn", variant: "destructive" as const }
        }
        
        if (discount.used_count >= discount.usage_limit) {
            return { label: "Đã hết lượt", variant: "destructive" as const }
        }
        
        return { label: "Đang hoạt động", variant: "default" as const }
    }

    const handleToggleStatus = async (discountId: string, currentStatus: boolean) => {
        setToggleLoading(discountId)
        try {
            await onToggleStatus(discountId, !currentStatus)
            toast.success(`${!currentStatus ? "Kích hoạt" : "Vô hiệu hóa"} mã giảm giá thành công!`)
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thay đổi trạng thái")
        } finally {
            setToggleLoading(null)
        }
    }

    const canDelete = (discount: Discount) => {
        return discount.used_count === 0
    }

    if (isLoading) {
        return (
            <div className="rounded-2xl border shadow-sm bg-white/85">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        )
    }

    if (discounts.length === 0) {
        return (
            <div className="rounded-2xl border shadow-sm bg-white/85">
                <div className="p-8 text-center">
                    <p className="text-muted-foreground">Không có mã giảm giá nào</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border shadow-sm bg-white/85">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b bg-muted/50">
                            <TableHead className="w-[120px]">Mã giảm giá</TableHead>
                            <TableHead className="w-[200px]">Tên chương trình</TableHead>
                            <TableHead className="w-[120px]">Loại</TableHead>
                            <TableHead className="w-[100px]">Giá trị</TableHead>
                            <TableHead className="w-[120px]">Đơn tối thiểu</TableHead>
                            <TableHead className="w-[120px]">Thời gian</TableHead>
                            <TableHead className="w-[100px]">Sử dụng</TableHead>
                            <TableHead className="w-[120px]">Trạng thái</TableHead>
                            <TableHead className="w-[80px]">Hoạt động</TableHead>
                            <TableHead className="w-[120px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discounts.map((discount) => {
                            const status = getDiscountStatus(discount)
                            return (
                                <TableRow key={discount._id} className="border-b transition-colors hover:bg-muted/50">
                                    <TableCell className="font-mono font-medium">
                                        {discount.code}
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[180px]">
                                            <div className="font-medium truncate" title={discount.name}>
                                                {discount.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground truncate" title={discount.description}>
                                                {discount.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {discount.discount_type === "percentage" ? "Phần trăm" : "Cố định"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatDiscountValue(discount)}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {formatCurrency(discount.min_order_value)}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div>
                                            {format(new Date(discount.start_date), "dd/MM/yy", { locale: vi })}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {format(new Date(discount.end_date), "dd/MM/yy", { locale: vi })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="text-center">
                                            <div className="font-medium">
                                                {discount.used_count}/{discount.usage_limit}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {Math.round((discount.used_count / discount.usage_limit) * 100)}%
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={discount.is_active}
                                            onCheckedChange={() => handleToggleStatus(discount._id, discount.is_active)}
                                            disabled={toggleLoading === discount._id}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEdit(discount)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                        disabled={!canDelete(discount)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xóa mã giảm giá</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa mã giảm giá <strong>"{discount.code}"</strong>?
                                                            <br />
                                                            Hành động này không thể hoàn tác.
                                                            {!canDelete(discount) && (
                                                                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                                                                    <strong>Lưu ý:</strong> Không thể xóa mã giảm giá đã được sử dụng.
                                                                </div>
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => onDelete(discount._id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                                                            disabled={!canDelete(discount)}
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
