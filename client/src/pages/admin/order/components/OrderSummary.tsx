import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Truck, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'
import { OrderProduct, OrderTab } from '../types'
import InputNumber from '@/components/InputNumber'
import InvoicePDFGenerator from './invoice-pdf-generator'

interface OrderSummaryProps {
    products: OrderProduct[]
    onCreateOrder: () => void
    orderTab?: OrderTab
}

export default function OrderSummary({
    products,
    onCreateOrder,
    orderTab
}: OrderSummaryProps) {
    const [discountAmount, setDiscountAmount] = useState(0)
    const [shippingFee, setShippingFee] = useState(30000) // Phí ship mặc định 30k
    const [paymentMethod, setPaymentMethod] = useState<string>('cod') // Mặc định chọn COD
    const [paymentStatus, setPaymentStatus] = useState('pending')
    const [showInvoice, setShowInvoice] = useState(false)

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

    // Xử lý thay đổi số tiền giảm giá
    const handleDiscountAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0
        setDiscountAmount(value)
    }

    // Xử lý thay đổi phương thức thanh toán (chỉ chọn 1)
    const handlePaymentMethodChange = (method: string, checked: boolean) => {
        if (checked) {
            setPaymentMethod(method) // Chỉ set method được chọn
        } else {
            setPaymentMethod('') // Bỏ chọn tất cả
        }
    }

    // Lấy icon cho trạng thái thanh toán
    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    // Lấy text cho trạng thái thanh toán
    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Đã thanh toán'
            case 'pending':
                return 'Chờ thanh toán'
            case 'failed':
                return 'Thanh toán thất bại'
            default:
                return 'Chờ thanh toán'
        }
    }

    // Kiểm tra có thể tạo đơn hàng không
    const canCreateOrder = products.length > 0

    return (
        <div className="flex flex-col h-full order-summary-sticky">
            {/* Tóm tắt đơn hàng */}
            <Card className="mx-2 mb-0">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Tóm tắt đơn hàng
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Giá sản phẩm:</span>
                            <span>{formatPrice(subtotal)}</span>
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
                    <Separator />

                    <div>
                        <Label htmlFor="payment-status">Trạng thái thanh toán</Label>
                        <div className="flex gap-2 mt-1">
                            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Chọn trạng thái thanh toán" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                            <span>Chờ thanh toán</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="paid">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Đã thanh toán</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="failed">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <span>Hủy đơn</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Nút tạo đơn hàng */}
            <div className="p-4 space-y-2">
                <Button
                    onClick={onCreateOrder}
                    disabled={!canCreateOrder}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                    size="sm"
                >
                    {canCreateOrder ? 'Tạo đơn hàng' : 'Chọn sản phẩm để tiếp tục'}
                </Button>

                {/* Nút xem hóa đơn */}
                {orderTab && orderTab.products.length > 0 && (
                    <Button
                        onClick={() => setShowInvoice(true)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Xem hóa đơn
                    </Button>
                )}
            </div>

            {/* Invoice PDF Generator */}
            {showInvoice && orderTab && (
                <InvoicePDFGenerator
                    orderTab={orderTab}
                    onDownload={() => setShowInvoice(false)}
                    setIsShowInvoice={setShowInvoice}
                />
            )}
        </div>
    )
}
