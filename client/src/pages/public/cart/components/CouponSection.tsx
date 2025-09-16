import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Tag, Percent, RefreshCw } from "lucide-react"
import { toast } from "react-toastify"
import { validateDiscountCodeAPIs } from "@/apis/discount.apis"
import { getCartTotal } from "@/utils/cart"

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

interface CouponSectionProps {
    onDiscountApplied?: (discount: AppliedDiscount | null) => void
}

export default function CouponSection({ onDiscountApplied }: CouponSectionProps) {
    const [couponCode, setCouponCode] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [lastCartTotal, setLastCartTotal] = useState(0)

    // Monitor cart total changes to revalidate discount
    useEffect(() => {
        const currentTotal = getCartTotal()

        if (appliedDiscount && lastCartTotal !== currentTotal && lastCartTotal > 0) {
            // Cart total changed, need to revalidate discount
            console.log('Cart total changed, revalidating discount...', {
                oldTotal: lastCartTotal,
                newTotal: currentTotal,
                discount: appliedDiscount.code
            })
            handleRevalidateDiscount(currentTotal)
        }

        setLastCartTotal(currentTotal)
    }, [appliedDiscount, lastCartTotal])

    // Also listen to cart updates via custom event
    useEffect(() => {
        const handleCartUpdate = () => {
            const currentTotal = getCartTotal()
            if (appliedDiscount && currentTotal !== lastCartTotal) {
                console.log('Cart updated via event, revalidating discount...', {
                    newTotal: currentTotal,
                    discount: appliedDiscount.code
                })
                handleRevalidateDiscount(currentTotal)
                setLastCartTotal(currentTotal)
            }
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate)
        }
    }, [appliedDiscount, lastCartTotal])

    const handleRevalidateDiscount = async (newTotal: number) => {
        if (!appliedDiscount) return

        try {
            setIsValidating(true)
            const response = await validateDiscountCodeAPIs(appliedDiscount.code, newTotal)

            if (response.data.success && response.data.data.valid) {
                const discountData = response.data.data.discount
                const updatedDiscount: AppliedDiscount = {
                    id: discountData.id,
                    code: discountData.code,
                    name: discountData.name,
                    discount_type: discountData.discount_type,
                    discount_value: discountData.discount_value,
                    discount_amount: discountData.discount_amount,
                    min_order_value: discountData.min_order_value,
                    max_discount_amount: discountData.max_discount_amount
                }

                // Check if discount amount changed
                const amountChanged = updatedDiscount.discount_amount !== appliedDiscount.discount_amount

                setAppliedDiscount(updatedDiscount)
                setError(null)
                onDiscountApplied?.(updatedDiscount)

                if (amountChanged) {
                    toast.success(`Mã giảm giá đã được cập nhật! Giảm ${formatPrice(updatedDiscount.discount_amount)}`, {
                        autoClose: 3000
                    })
                }
            }
        } catch (error: any) {
            console.error("Revalidation failed:", error)

            let errorMessage = "Mã giảm giá không còn hợp lệ"

            if (error.response?.data?.message) {
                const apiMessage = error.response.data.message
                if (apiMessage.includes('Minimum order value')) {
                    errorMessage = `Mã giảm giá yêu cầu đơn hàng tối thiểu ${apiMessage.split('is ')[1]}`
                } else if (apiMessage.includes('has expired')) {
                    errorMessage = "Mã giảm giá đã hết hạn"
                } else if (apiMessage.includes('usage limit reached')) {
                    errorMessage = "Mã giảm giá đã hết lượt sử dụng"
                }
            }

            // Remove the discount
            setAppliedDiscount(null)
            setError(errorMessage)
            onDiscountApplied?.(null)
            toast.error(`Đã xóa mã giảm giá: ${errorMessage}`, {
                autoClose: 5000
            })
        } finally {
            setIsValidating(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Vui lòng nhập mã giảm giá")
            return
        }

        setIsValidating(true)
        setError(null)

        try {
            const orderValue = getCartTotal()

            if (orderValue <= 0) {
                toast.error("Giỏ hàng trống, không thể áp dụng mã giảm giá")
                return
            }

            const response = await validateDiscountCodeAPIs(couponCode.trim(), orderValue)

            if (response.data.success && response.data.data.valid) {
                const discountData = response.data.data.discount
                const appliedDiscountData: AppliedDiscount = {
                    id: discountData.id,
                    code: discountData.code,
                    name: discountData.name,
                    discount_type: discountData.discount_type,
                    discount_value: discountData.discount_value,
                    discount_amount: discountData.discount_amount,
                    min_order_value: discountData.min_order_value,
                    max_discount_amount: discountData.max_discount_amount
                }

                setAppliedDiscount(appliedDiscountData)
                setError(null)

                // Notify parent component about applied discount
                onDiscountApplied?.(appliedDiscountData)

                toast.success(`Áp dụng mã giảm giá thành công! Giảm ${formatPrice(discountData.discount_amount)}`)
            }
        } catch (error: any) {
            console.error("Error validating coupon:", error)

            let errorMessage = "Có lỗi xảy ra khi kiểm tra mã giảm giá"

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message

                // Customize error messages for better UX
                if (errorMessage.includes('Invalid discount code')) {
                    errorMessage = "Mã giảm giá không tồn tại"
                } else if (errorMessage.includes('not yet active')) {
                    errorMessage = "Mã giảm giá chưa có hiệu lực"
                } else if (errorMessage.includes('has expired')) {
                    errorMessage = "Mã giảm giá đã hết hạn"
                } else if (errorMessage.includes('usage limit reached')) {
                    errorMessage = "Mã giảm giá đã hết lượt sử dụng"
                } else if (errorMessage.includes('already used')) {
                    errorMessage = "Bạn đã sử dụng mã giảm giá này rồi"
                } else if (errorMessage.includes('Minimum order value')) {
                    errorMessage = errorMessage.replace('Minimum order value is', 'Giá trị đơn hàng tối thiểu là')
                }
            } else if (error.message) {
                errorMessage = error.message
            }

            setError(errorMessage)
            setAppliedDiscount(null)
            onDiscountApplied?.(null)
            toast.error(errorMessage)
        } finally {
            setIsValidating(false)
        }
    }

    const handleRemoveCoupon = () => {
        setAppliedDiscount(null)
        setError(null)
        setCouponCode("")
        onDiscountApplied?.(null)
        toast.info("Đã xóa mã giảm giá")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyCoupon()
        }
    }

    return (
        <div className="space-y-4">
            {/* Input section */}
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <Input
                        placeholder="Nhập mã giảm giá"
                        className="border-gray-300"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        disabled={isValidating || !!appliedDiscount}
                    />
                </div>
                <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                    onClick={appliedDiscount ? handleRemoveCoupon : handleApplyCoupon}
                    disabled={isValidating}
                >
                    {isValidating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {appliedDiscount ? "Xóa mã" : "Áp dụng"}
                </Button>
            </div>

            {/* Error message */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Applied discount info */}
            {appliedDiscount && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    {isValidating ? (
                                        <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                                    ) : (
                                        <Tag className="w-4 h-4 text-green-600" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="font-medium text-green-800">
                                            Mã giảm giá: {appliedDiscount.code}
                                        </span>
                                        {isValidating && (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                                Đang cập nhật...
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-green-700 mt-1">
                                        {appliedDiscount.name}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-green-600">
                                        <div className="flex items-center gap-1">
                                            {appliedDiscount.discount_type === "percentage" ? (
                                                <Percent className="w-3 h-3" />
                                            ) : (
                                                <span className="text-xs">₫</span>
                                            )}
                                            <span>
                                                {appliedDiscount.discount_type === "percentage"
                                                    ? `${appliedDiscount.discount_value}%`
                                                    : formatPrice(appliedDiscount.discount_value)
                                                }
                                            </span>
                                        </div>
                                        <span>•</span>
                                        <span>Giảm: {formatPrice(appliedDiscount.discount_amount)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRevalidateDiscount(getCartTotal())}
                                    disabled={isValidating}
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                    {isValidating ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-3 h-3" />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveCoupon}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <XCircle className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
