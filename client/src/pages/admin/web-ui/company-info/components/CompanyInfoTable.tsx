"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye, 
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ExternalLink
} from "lucide-react"
import { toast } from "react-toastify"
import { deleteCompanyInfoAPIs, formatCompanyInfoForDisplay, truncateText } from "@/apis/company-info.apis"
import SocialMediaManager from "./SocialMediaManager"

interface CompanyInfoTableProps {
    companyInfos: CompanyInfo[]
    loading: boolean
    onEdit: (companyInfo: CompanyInfo) => void
    onView: (companyInfo: CompanyInfo) => void
    onDelete: (id: string) => void
    onUpdate: (updatedCompanyInfo: CompanyInfo) => void
    sortBy: string
    sortOrder: 'asc' | 'desc'
    onSort: (field: string) => void
}

export default function CompanyInfoTable({
    companyInfos,
    loading,
    onEdit,
    onView,
    onDelete,
    onUpdate,
    sortBy,
    sortOrder,
    onSort
}: CompanyInfoTableProps) {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        companyInfo: CompanyInfo | null
    }>({ open: false, companyInfo: null })
    const [deleting, setDeleting] = useState(false)

    const handleDeleteClick = (companyInfo: CompanyInfo) => {
        setDeleteDialog({ open: true, companyInfo })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.companyInfo) return

        setDeleting(true)
        try {
            await deleteCompanyInfoAPIs(deleteDialog.companyInfo._id)
            toast.success("Xóa thông tin công ty thành công!")
            onDelete(deleteDialog.companyInfo._id)
            setDeleteDialog({ open: false, companyInfo: null })
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa thông tin công ty")
        } finally {
            setDeleting(false)
        }
    }

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    }

    const handleSort = (field: string) => {
        onSort(field)
    }

    if (loading) {
        return (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên Công Ty</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Điện Thoại</TableHead>
                            <TableHead>Social Media</TableHead>
                            <TableHead>Ngày Tạo</TableHead>
                            <TableHead className="text-right">Thao Tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="animate-pulse bg-gray-200 h-4 rounded w-32"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="animate-pulse bg-gray-200 h-4 rounded w-40"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="animate-pulse bg-gray-200 h-4 rounded w-20"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="animate-pulse bg-gray-200 h-8 rounded w-8 ml-auto"></div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (companyInfos.length === 0) {
        return (
            <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Không có thông tin công ty nào</p>
            </div>
        )
    }

    return (
        <>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort('company_name')}
                                    className="h-auto p-0 font-medium"
                                >
                                    Tên Công Ty
                                    {getSortIcon('company_name')}
                                </Button>
                            </TableHead>
                            <TableHead>Email & Liên Hệ</TableHead>
                            <TableHead>Địa Chỉ</TableHead>
                            <TableHead>Social Media</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort('createdAt')}
                                    className="h-auto p-0 font-medium"
                                >
                                    Ngày Tạo
                                    {getSortIcon('createdAt')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">Thao Tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companyInfos.map((companyInfo) => {
                            const formatted = formatCompanyInfoForDisplay(companyInfo)
                            
                            return (
                                <TableRow key={companyInfo._id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{companyInfo.company_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {truncateText(companyInfo.company_description, 50)}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">{companyInfo.company_email}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0"
                                                    onClick={() => window.open(`mailto:${companyInfo.company_email}`, '_blank')}
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm text-muted-foreground">{companyInfo.company_phone}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0"
                                                    onClick={() => window.open(`tel:${companyInfo.company_phone}`, '_blank')}
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{truncateText(companyInfo.company_address, 40)}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <SocialMediaManager 
                                                companyInfo={companyInfo}
                                                onUpdate={onUpdate}
                                                compact={true}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm">{formatted.createdAt}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Cập nhật: {formatted.updatedAt}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onView(companyInfo)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Xem Chi Tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(companyInfo)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteClick(companyInfo)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => 
                setDeleteDialog({ open, companyInfo: deleteDialog.companyInfo })
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa thông tin công ty "{deleteDialog.companyInfo?.company_name}"? 
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
