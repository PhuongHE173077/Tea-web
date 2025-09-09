"use client"

import { deleteProductAPIs, fetchProductsAPIs } from "@/apis/product.apis"
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
    Coffee,
    Eye,
    Image as ImageIcon,
    Package,
    Pencil,
    Star,
    Trash2
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2";

export default function ProductManagement() {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    // Đọc parameters từ URL hoặc sử dụng giá trị mặc định
    const page = parseInt(searchParams.get('page') || '1', 10)
    const size = parseInt(searchParams.get('size') || '10', 10)

    // Hàm cập nhật URL parameters
    const updateURLParams = (newPage: number, newSize: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        params.set('size', newSize.toString())
        setSearchParams(params, { replace: true })
    }

    // Hàm xử lý thay đổi trang
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateURLParams(newPage, size)
        }
    }

    // Hàm xử lý thay đổi kích thước trang
    const handleSizeChange = (newSize: number) => {
        // Khi thay đổi size, reset về trang 1
        updateURLParams(1, newSize)
    }

    // Fetch data khi URL parameters thay đổi
    useEffect(() => {
        // Validate page và size
        const validPage = Math.max(1, page)
        const validSize = Math.max(1, Math.min(100, size)) // Giới hạn size từ 1-100

        // Nếu parameters không hợp lệ, sửa lại URL
        if (validPage !== page || validSize !== size) {
            updateURLParams(validPage, validSize)
            return
        }

        setLoading(true)
        fetchProductsAPIs({ page: validPage, size: validSize, search: "" })
            .then((res) => {
                setProducts(res.data)
                setTotalProducts(res.total)
                const newTotalPages = Math.ceil(res.total / validSize)
                setTotalPages(newTotalPages)

                // Nếu trang hiện tại lớn hơn tổng số trang, chuyển về trang cuối
                if (validPage > newTotalPages && newTotalPages > 0) {
                    updateURLParams(newTotalPages, validSize)
                }
            })
            .catch((error) => {
                console.error('Error fetching products:', error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [page, size])

    const handleView = (p: Product) => {
        setSelectedProduct(p)
        setOpen(true)
    }


    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProductAPIs(id).then(() => {
                    setProducts(prev => prev.filter(p => p._id !== id))
                }).then(() => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    fetchProductsAPIs({ page, size, search: "" }).then((res) => {
                        setProducts(res.data)
                        setTotalProducts(res.total)
                        const newTotalPages = Math.ceil(res.total / size)
                        setTotalPages(newTotalPages)

                        // Nếu trang hiện tại lớn hơn tổng số trang mới, chuyển về trang cuối
                        if (page > newTotalPages && newTotalPages > 0) {
                            handlePageChange(newTotalPages)
                        }
                    })
                })

            }
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">📦 Quản lý Trà</h2>
                <Button className="rounded-xl" onClick={() => { navigate("/products/new") }}>+ Thêm sản phẩm</Button>
            </div>

            {/* Desktop: Enhanced Table */}
            {!isMobile && (
                <div className="bg-white border rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-tea-green to-tea-green-light p-4">
                        <h3 className="text-black font-semibold flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Danh sách sản phẩm ({products.length} sản phẩm)
                        </h3>
                    </div>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-gray-50/80">
                                <TableHead className="w-20 text-center">Ảnh</TableHead>
                                <TableHead className="min-w-[200px]">Thông tin sản phẩm</TableHead>
                                <TableHead className="w-32">Danh mục</TableHead>
                                <TableHead className="w-32 text-center">Giá cơ bản</TableHead>
                                <TableHead className="w-40">Phân loại & Giá</TableHead>
                                <TableHead className="w-32 text-center">Đánh giá</TableHead>
                                <TableHead className="w-24 text-center">Trạng thái</TableHead>
                                <TableHead className="w-32 text-center">Ngày tạo</TableHead>
                                <TableHead className="w-32 text-center">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: size }).map((_, index) => (
                                    <TableRow key={`loading-${index}`} className="border-b border-gray-100">
                                        <TableCell className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto animate-pulse" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="space-y-1">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                                                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                                                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                                                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <div className="text-gray-500">Không có sản phẩm nào</div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((p) => (
                                    <TableRow
                                        key={p._id}
                                        className="hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100"
                                    >
                                        {/* Ảnh sản phẩm */}
                                        <TableCell className="text-center">
                                            <div className="relative group">
                                                <img
                                                    src={p.product_thumb}
                                                    alt={p.product_name}
                                                    className="w-16 h-16 rounded-xl border-2 border-gray-200 object-cover mx-auto shadow-sm group-hover:shadow-md transition-shadow"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
                                            </div>
                                        </TableCell>

                                        {/* Thông tin sản phẩm */}
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                                                    {p.product_name}
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    {p.product_images && p.product_images.length > 1 && (
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <ImageIcon className="w-4 h-4" />
                                                            <span>{p.product_images.length} ảnh</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Danh mục */}
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-tea-green/10 text-tea-green border-tea-green/20">
                                                {p.product_category.category_name}
                                            </Badge>
                                        </TableCell>

                                        {/* Giá cơ bản */}
                                        <TableCell className="text-center">
                                            <div className="font-bold text-lg text-tea-green">
                                                {(p.product_basePrice || 0).toLocaleString()}
                                            </div>
                                            <div className="text-xs text-gray-500">VND</div>
                                        </TableCell>

                                        {/* Phân loại & Giá */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                {p.product_attribute.length === 0 ? (
                                                    <div className="text-sm text-gray-400 italic">
                                                        Không có phân loại
                                                    </div>
                                                ) : (
                                                    p.product_attribute.map((attr, index) => (
                                                        <div key={`${index}-${attr.name}`} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                            <div className="text-sm font-medium">
                                                                {attr.name === "package" ? `Túi ${attr.unit}` : "Hộp"}
                                                            </div>
                                                            <div className="text-sm font-bold text-tea-green">
                                                                {Array.isArray(attr.price)
                                                                    ? (Number(attr.price[0]) || 0).toLocaleString()
                                                                    : (Number(attr.price) || 0).toLocaleString()
                                                                } VND
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Đánh giá */}
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-bold text-lg">{p.product_ratingAverage}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {/* Có thể thêm số lượng đánh giá nếu có */}
                                                    Đánh giá
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Trạng thái */}
                                        <TableCell className="text-center">
                                            {p.isPublished ? (
                                                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                                    Hoạt động
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                                    Tạm dừng
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Ngày tạo */}
                                        <TableCell className="text-center">
                                            <div className="text-sm text-gray-600">
                                                {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(p.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </TableCell>

                                        {/* Hành động */}
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                                                                onClick={() => handleView(p)}
                                                            >
                                                                <Eye className="w-4 h-4 text-blue-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Xem chi tiết</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200"
                                                                onClick={() => navigate(`/products/${p.product_slug}`)}
                                                            >
                                                                <Pencil className="w-4 h-4 text-green-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Chỉnh sửa</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                                                                onClick={() => handleDelete(p._id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Xóa sản phẩm</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )
            }

            {/* Enhanced Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {products.length} trên tổng số {totalProducts} sản phẩm
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Hiển thị:</span>
                        <Select value={size.toString()} onValueChange={(value) => handleSizeChange(parseInt(value, 10))}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
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

            {/* Enhanced Mobile Card List */}
            {isMobile && (
                <div className="space-y-4">
                    {products.map((p) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <img
                                            src={p.product_thumb}
                                            alt={p.product_name}
                                            className="w-20 h-20 rounded-xl border-2 border-gray-200 object-cover"
                                        />
                                        <div className="absolute -top-2 -right-2">
                                            {p.isPublished ? (
                                                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            ) : (
                                                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate text-lg">
                                            {p.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                            {p.product_description}
                                        </p>

                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm font-medium">{p.product_ratingAverage}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-tea-green/10 text-tea-green text-xs">
                                                {p.product_category.category_name}
                                            </Badge>
                                        </div>

                                        <div className="mt-3">
                                            <div className="text-lg font-bold text-tea-green">
                                                {(p.product_basePrice || 0).toLocaleString()} VND
                                            </div>
                                            {p.product_attribute.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {p.product_attribute.length} phân loại
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="text-xs text-gray-500">
                                        {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 px-3"
                                            onClick={() => handleView(p)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Xem
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 px-3"
                                            onClick={() => navigate(`/products/${p.product_slug}`)}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 px-3"
                                            onClick={() => handleDelete(p._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Enhanced Modal chi tiết sản phẩm */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Coffee className="w-6 h-6 text-tea-green" />
                            {selectedProduct?.product_name}
                        </DialogTitle>
                        <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary" className="bg-tea-green/10 text-tea-green">
                                {selectedProduct?.product_category.category_name}
                            </Badge>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-medium">{selectedProduct?.product_ratingAverage}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                ID: {selectedProduct?._id}
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cột 1: Ảnh và thông tin cơ bản */}
                        <div className="space-y-4">
                            {selectedProduct && (
                                <div className="space-y-4">
                                    <img
                                        src={selectedProduct.product_thumb}
                                        alt={selectedProduct.product_name}
                                        className="w-full aspect-square rounded-xl border-2 border-gray-200 object-cover shadow-lg"
                                    />

                                    {/* Gallery ảnh */}
                                    {selectedProduct.product_images && selectedProduct.product_images.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" />
                                                Thư viện ảnh ({selectedProduct.product_images.length})
                                            </h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedProduct.product_images.slice(0, 4).map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt={`${selectedProduct.product_name} ${index + 1}`}
                                                        className="w-full aspect-square rounded-lg border object-cover"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cột 2: Thông tin chi tiết */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Mô tả */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        📝 Mô tả sản phẩm
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        {selectedProduct?.product_description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Giá và phân loại */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        💰 Thông tin giá
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-tea-green/5 rounded-lg">
                                            <span className="font-medium">Giá cơ bản:</span>
                                            <span className="text-xl font-bold text-tea-green">
                                                {(selectedProduct?.product_basePrice || 0).toLocaleString()} VND
                                            </span>
                                        </div>

                                        {selectedProduct?.product_attribute && selectedProduct.product_attribute.length > 0 && (
                                            <div>
                                                <h5 className="font-medium mb-2">Phân loại sản phẩm:</h5>
                                                <div className="space-y-2">
                                                    {selectedProduct.product_attribute.map((attr, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <span className="font-medium">
                                                                    {attr.name === "package" ? `Túi ${attr.unit}` : "Hộp"}
                                                                </span>
                                                            </div>
                                                            <span className="font-bold text-tea-green">
                                                                {Array.isArray(attr.price)
                                                                    ? (Number(attr.price[0]) || 0).toLocaleString()
                                                                    : (Number(attr.price) || 0).toLocaleString()
                                                                } VND
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Hướng dẫn pha chế */}
                            {selectedProduct?.product_brewing && selectedProduct.product_brewing.length > 0 && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            ☕ Hướng dẫn pha chế
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProduct.product_brewing.map((step, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-tea-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-gray-700">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Thông tin trạng thái */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        📊 Trạng thái sản phẩm
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">Trạng thái</div>
                                            <div className="mt-1">
                                                {selectedProduct?.isPublished ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                        Hoạt động
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Tạm dừng
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">Ngày tạo</div>
                                            <div className="mt-1 font-medium">
                                                {selectedProduct?.createdAt &&
                                                    new Date(selectedProduct.createdAt).toLocaleDateString('vi-VN')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div >
    )
}
