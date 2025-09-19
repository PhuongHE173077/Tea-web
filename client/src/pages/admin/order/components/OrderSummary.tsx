import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Percent } from 'lucide-react'

interface OrderProduct {
    _id: string
    product_name: string
    product_thumb: string
    product_basePrice: number
    quantity: number
    size?: string
    price: number
    total: number
}

interface OrderSummaryProps {
    products: OrderProduct[]
    onCreateOrder: () => void
}

export default function OrderSummary({
    products,
    onCreateOrder
}: OrderSummaryProps) {
    const [discountCode, setDiscountCode] = useState('')
    const [discountAmount, setDiscountAmount] = useState(0)
    const [shippingFee, setShippingFee] = useState(30000) // Phí ship mặc định 30k

    // Tính toán tổng tiền
    const subtotal = products.reduce((sum, product) => sum + product.total, 0)
    const total = subtotal - discountAmount + shippingFee

    // Format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Áp dụng mã giảm giá (demo)
    const applyDiscount = () => {
        if (discountCode === 'GIAM10') {
            setDiscountAmount(subtotal * 0.1) // Giảm 10%
        } else if (discountCode === 'GIAM50K') {
            setDiscountAmount(50000) // Giảm 50k
        } else {
            setDiscountAmount(0)
        }
    }

    // Kiểm tra có thể tạo đơn hàng không
    const canCreateOrder = products.length > 0

    return (
        <div className="flex flex-col h-full order-summary-sticky">
            {/* Tóm tắt đơn hàng */}
            <Card className="m-2 mb-0">
                <CardHeader>

                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="discount-code">Mã giảm giá</Label>
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="discount-code"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                placeholder="Nhập mã giảm giá"
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                onClick={applyDiscount}
                                className="px-3"
                            >
                                <Percent className="h-4 w-4" />
                            </Button>
                        </div>
                        {discountAmount > 0 && (
                            <p className="text-green-600 text-sm mt-1">
                                Đã áp dụng: -{formatPrice(discountAmount)}
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* Tổng cộng */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Giá sản phẩm:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-green-600">
                            <span>Giảm giá:</span>
                            <span>
                                {formatPrice(discountAmount || 0)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Phí vận chuyển:</span>
                            <span>{formatPrice(shippingFee)}</span>
                        </div>

                        <Separator />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Tổng cộng:</span>
                            <span className="text-red-500">{formatPrice(total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Nút tạo đơn hàng */}
            <div className="p-4">
                <Button
                    onClick={onCreateOrder}
                    disabled={!canCreateOrder}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                    size="sm"
                >
                    {canCreateOrder ? 'Tạo đơn hàng' : 'Chọn sản phẩm để tiếp tục'}
                </Button>
            </div>
        </div>
    )
}
