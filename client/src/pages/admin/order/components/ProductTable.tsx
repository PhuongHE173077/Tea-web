import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface OrderProduct {
    _id: string
    product_name: string
    product_thumb: string
    product_basePrice: number
    quantity: number
    price: number
    total: number
}

interface ProductTableProps {
    products: OrderProduct[]
    onProductsChange: (products: OrderProduct[]) => void
}

export default function ProductTable({
    products,
    onProductsChange
}: ProductTableProps) {

    // Cập nhật số lượng
    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeProduct(productId)
            return
        }

        const updatedProducts = products.map(product => {
            if (product._id === productId) {
                const total = product.price * newQuantity
                return { ...product, quantity: newQuantity, total }
            }
            return product
        })
        onProductsChange(updatedProducts)
    }

    // Xóa sản phẩm
    const removeProduct = (productId: string) => {
        const updatedProducts = products.filter(product => product._id !== productId)
        onProductsChange(updatedProducts)
    }

    // Format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    return (
        <div className="flex-1 flex flex-col ">
            {/* Bảng sản phẩm đã chọn */}
            <div className=" bg-white p-6 ">
                <h3 className="text-lg font-semibold mb-4">Sản phẩm đã chọn ({products.length})</h3>

                {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có sản phẩm nào được chọn
                    </div>
                ) : (
                    <Table className='rounded-lg border'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Đơn giá</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Thành tiền</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={product._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <img
                                            src={product.product_thumb}
                                            alt={product.product_name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {product.product_name}
                                    </TableCell>

                                    <TableCell>{formatPrice(product.price)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateQuantity(product._id, product.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center">{product.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateQuantity(product._id, product.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-red-500">
                                        {formatPrice(product.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeProduct(product._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
