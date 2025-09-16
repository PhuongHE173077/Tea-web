import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Trash2 } from "lucide-react"
import {
    getCartFromStorage,
    updateCartItemQuantity,
    removeProductFromCart,
    clearCart,
    getCartTotal,
    CartItem
} from "@/utils/cart"
import { toast } from "react-toastify"
import CartTable from './components/CartTable'
import CouponSection from './components/CouponSection'
import CartSummary from './components/CartSummary'

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

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)

    // Lấy dữ liệu giỏ hàng
    const loadCartData = () => {
        const items = getCartFromStorage()
        setCartItems(items)
        setLoading(false)
    }

    useEffect(() => {
        loadCartData()

        const handleCartUpdate = () => {
            loadCartData()
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate)
        }
    }, [])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
        const success = updateCartItemQuantity(
            item.id,
            newQuantity,
            item.attribute ? { name: item.attribute.name, unit: item.attribute.unit } : undefined
        )

        if (success) {
            loadCartData()
            if (newQuantity === 0) {
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')
            }
            // Trigger discount revalidation will be handled by CouponSection useEffect
        } else {
            toast.error('Có lỗi xảy ra khi cập nhật giỏ hàng!')
        }
    }

    const handleRemoveItem = (item: CartItem) => {
        const success = removeProductFromCart(
            item.id,
            item.attribute ? { name: item.attribute.name, unit: item.attribute.unit } : undefined
        )

        if (success) {
            loadCartData()
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')
            // Trigger discount revalidation will be handled by CouponSection useEffect
        } else {
            toast.error('Có lỗi xảy ra khi xóa sản phẩm!')
        }
    }

    // Xóa toàn bộ giỏ hàng
    const handleClearCart = () => {
        const success = clearCart()
        if (success) {
            setAppliedDiscount(null) // Clear discount when cart is cleared
            loadCartData()
            toast.success('Đã xóa toàn bộ giỏ hàng!')
        } else {
            toast.error('Có lỗi xảy ra khi xóa giỏ hàng!')
        }
    }

    const handleDiscountApplied = (discount: AppliedDiscount | null) => {
        setAppliedDiscount(discount)
    }

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Đang tải...</div>
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto text-center">
                    <CardContent className="p-8">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
                        <p className="text-muted-foreground mb-4">
                            Bạn chưa thêm sản phẩm nào vào giỏ hàng
                        </p>
                        <Button onClick={() => window.history.back()}>
                            Tiếp tục mua sắm
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const total = getCartTotal()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
                <Button variant="outline" onClick={handleClearCart}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa tất cả
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <CartTable
                        cartItems={cartItems}
                        formatPrice={formatPrice}
                        handleUpdateQuantity={handleUpdateQuantity}
                        handleRemoveItem={handleRemoveItem}
                        loadCartData={loadCartData}
                    />
                    <CouponSection onDiscountApplied={handleDiscountApplied} />
                </div>

                <CartSummary
                    total={total}
                    formatPrice={formatPrice}
                    appliedDiscount={appliedDiscount}
                />
            </div>
        </div>
    )
}
