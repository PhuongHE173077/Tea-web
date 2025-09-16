import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Truck, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { shipService } from '@/services/ship.service'

interface AppliedDiscount {
    id: string
    code: string
    name: string
    discount_type: "percentage" | "fixed_amount"
    discount_value: number
    discount_amount: number
    min_order_value: number
    max_discount_amount?: number
}

interface CartSummaryProps {
    total: number
    formatPrice: (price: number) => string
    appliedDiscount?: AppliedDiscount | null
}

interface ShippingInfo {
    fee: number
    freeShippingThreshold: number
    isFreeShipping: boolean
    isLoading: boolean
    error: string | null
}

export default function CartSummary({ total, formatPrice, appliedDiscount }: CartSummaryProps) {
    const navigate = useNavigate()
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fee: 0,
        freeShippingThreshold: 0,
        isFreeShipping: false,
        isLoading: true,
        error: null
    })

    // Calculate shipping fee when total changes
    useEffect(() => {
        const calculateShipping = async () => {
            if (total <= 0) {
                setShippingInfo(prev => ({
                    ...prev,
                    fee: 0,
                    isFreeShipping: false,
                    isLoading: false,
                    error: null
                }))
                return
            }

            try {
                setShippingInfo(prev => ({ ...prev, isLoading: true, error: null }))

                const response = await shipService.calculateShippingFee({ orderValue: total })

                setShippingInfo({
                    fee: response.data.shippingFee,
                    freeShippingThreshold: response.data.freeShippingThreshold,
                    isFreeShipping: response.data.isFreeShipping,
                    isLoading: false,
                    error: null
                })
            } catch (error: any) {
                console.error('Error calculating shipping fee:', error)

                // Fallback to default values if API fails
                const fallbackFee = total >= 500000 ? 0 : 30000
                const fallbackThreshold = 500000

                setShippingInfo({
                    fee: fallbackFee,
                    freeShippingThreshold: fallbackThreshold,
                    isFreeShipping: fallbackFee === 0,
                    isLoading: false,
                    error: 'Không thể tải thông tin phí ship. Sử dụng mức phí mặc định.'
                })

                // Show error toast but don't block user experience
                toast.error('Không thể tải thông tin phí ship mới nhất', {
                    position: 'bottom-right',
                    autoClose: 3000,
                })
            }
        }

        calculateShipping()
    }, [total])

    const discountAmount = appliedDiscount?.discount_amount || 0
    const subtotalAfterDiscount = total - discountAmount
    const finalTotal = subtotalAfterDiscount + shippingInfo.fee

    const handleCheckout = () => {
        if (total <= 0) {
            toast.error('Giỏ hàng trống, không thể thanh toán')
            return
        }

        // Navigate to checkout page with state
        navigate('/checkout', {
            state: {
                cartTotal: total,
                appliedDiscount: appliedDiscount,
                shippingFee: shippingInfo.fee,
                finalTotal: finalTotal
            }
        })
    }

    return (
        <div className="lg:col-span-1">
            <Card style={{ backgroundColor: 'hsl(45, 36%, 92%)' }}>
                <CardHeader>
                    <CardTitle className="text-lg">TỔNG GIỎ HÀNG</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span className="text-red-500 font-medium">{formatPrice(total)}</span>
                    </div>

                    {/* Discount section */}
                    {appliedDiscount && (
                        <div className="flex justify-between text-green-600 border-t pt-2">
                            <span className="flex items-center gap-2">
                                <span>Giảm giá ({appliedDiscount.code})</span>
                                {appliedDiscount.discount_type === "percentage" && (
                                    <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                                        {appliedDiscount.discount_value}%
                                    </span>
                                )}
                            </span>
                            <span className="font-medium">-{formatPrice(appliedDiscount.discount_amount)}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="font-medium flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Giao hàng
                        </div>

                        {/* Shipping Info */}
                        <div className="space-y-2">
                            {shippingInfo.isLoading ? (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang tính phí ship...
                                </div>
                            ) : shippingInfo.error ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-amber-600">
                                        <AlertCircle className="w-4 h-4" />
                                        {shippingInfo.error}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Phí ship: {shippingInfo.isFreeShipping ? 'Miễn phí' : formatPrice(shippingInfo.fee)}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {shippingInfo.isFreeShipping ? (
                                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                                            <span className="text-sm text-green-700 font-medium">
                                                🎉 Miễn phí giao hàng
                                            </span>
                                            <span className="text-sm text-green-600 font-bold">
                                                0 ₫
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Phí giao hàng:</span>
                                                <span className="text-sm font-medium">{formatPrice(shippingInfo.fee)}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                                                💡 Miễn phí ship cho đơn hàng từ {formatPrice(shippingInfo.freeShippingThreshold)}
                                                {shippingInfo.freeShippingThreshold > total && (
                                                    <span className="block mt-1 text-blue-600">
                                                        Thêm {formatPrice(shippingInfo.freeShippingThreshold - total)} để được miễn phí ship
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-4 border-t">
                        <span>Tổng</span>
                        <div className="text-right">
                            {shippingInfo.isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang tính...
                                </div>
                            ) : (
                                <>
                                    {appliedDiscount && total !== subtotalAfterDiscount && (
                                        <div className="text-sm text-gray-500 line-through">
                                            {formatPrice(total + shippingInfo.fee)}
                                        </div>
                                    )}
                                    <span className="text-red-500">{formatPrice(finalTotal)}</span>
                                    {appliedDiscount && (
                                        <div className="text-xs text-green-600 mt-1">
                                            Tiết kiệm {formatPrice(appliedDiscount.discount_amount)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium"
                        disabled={shippingInfo.isLoading}
                        onClick={handleCheckout}
                    >
                        {shippingInfo.isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Đang tính phí...
                            </>
                        ) : (
                            'TIẾN HÀNH THANH TOÁN'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
