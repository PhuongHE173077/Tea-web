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
import { ShipConfig } from '@/types/ship'

interface OrderSummaryProps {
    products: OrderProduct[]
    onCreateOrder: () => void
    orderTab?: OrderTab
    setTabs: React.Dispatch<React.SetStateAction<OrderTab[]>>,
    shipping: ShipConfig
}

export default function OrderSummary({
    products,
    onCreateOrder,
    orderTab,
    shipping,
    setTabs
}: OrderSummaryProps) {
    console.log("🚀 ~ OrderSummary ~ shipping:", shipping)
    const [paymentMethod, setPaymentMethod] = useState<string>('cod') // Mặc định chọn COD
    const [showInvoice, setShowInvoice] = useState(false)

    // Tính toán tổng tiền
    const subtotal = products.reduce((sum, product) => sum + product.total, 0)
    const shippingFee = subtotal >= shipping.freeShippingThreshold ? 0 : shipping.shippingFee

    const total = subtotal - orderTab?.discountAmount + shippingFee

    // Format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Kiểm tra có thể tạo đơn hàng không
    const canCreateOrder = products.length > 0

    const handleDiscountChange = (e: any) => {
        const discountAmount = e;
        setTabs((prevTabs) =>
            prevTabs.map((tab) => {
                if (tab.id === orderTab?.id) {
                    return { ...tab, discountAmount };
                }
                return tab;
            })
        );
    }

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

                        <div className="flex justify-between items-center text-sm">
                            <span>Giảm giá:</span>
                            <span className='w-[90px]'><InputNumber className='h-7' value={orderTab?.discountAmount || 0} onChange={(e) => handleDiscountChange(e)} /></span>
                        </div>


                        <div className="flex justify-between text-sm">
                            <span>Phí vận chuyển:</span>
                            <span>{shippingFee}</span>
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
                            <Select
                                value={orderTab.paymentInfo?.status}
                                onValueChange={(value) => {
                                    setTabs((prevTabs) =>
                                        prevTabs.map((tab) => {
                                            if (tab.id === orderTab?.id) {
                                                return {
                                                    ...tab,
                                                    paymentInfo: {
                                                        ...tab.paymentInfo,
                                                        status: value as 'pending' | 'paid' | 'failed' | 'refunded',
                                                    },
                                                };
                                            }
                                            return tab;
                                        })
                                    );
                                }}
                            >
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
