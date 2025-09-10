import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCartItemCount } from "@/utils/cart"

interface CartBadgeProps {
    className?: string
    showText?: boolean
}

export function CartBadge({ className = "", showText = false }: CartBadgeProps) {
    const [itemCount, setItemCount] = useState(0)

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    const updateCartCount = () => {
        setItemCount(getCartItemCount())
    }

    useEffect(() => {
        // Cập nhật số lượng khi component mount
        updateCartCount()

        // Lắng nghe sự kiện storage để cập nhật khi localStorage thay đổi
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'tea_cart') {
                updateCartCount()
            }
        }

        // Lắng nghe sự kiện custom để cập nhật khi thêm sản phẩm từ cùng tab
        const handleCartUpdate = () => {
            updateCartCount()
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('cartUpdated', handleCartUpdate)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('cartUpdated', handleCartUpdate)
        }
    }, [])

    return (
        <Button variant="ghost" size="sm" className={`relative ${className}`}>
            <ShoppingCart className="w-5 h-5" />
            {showText && <span className="ml-2">Giỏ hàng</span>}
            {itemCount > 0 && (
                <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                    {itemCount > 99 ? '99+' : itemCount}
                </Badge>
            )}
        </Button>
    )
}
