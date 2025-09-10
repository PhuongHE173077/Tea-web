// Interface cho item trong giỏ hàng
export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
    attribute?: {
        name: string
        unit: string
        price: number
        image?: string
    }
}

// Lấy giỏ hàng từ localStorage
export const getCartFromStorage = (): CartItem[] => {
    try {
        const cart = localStorage.getItem('tea_cart')
        return cart ? JSON.parse(cart) : []
    } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
        return []
    }
}

// Lưu giỏ hàng vào localStorage
export const saveCartToStorage = (cart: CartItem[]) => {
    try {
        localStorage.setItem('tea_cart', JSON.stringify(cart))
        // Dispatch custom event để thông báo cart đã được cập nhật
        window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (error) {
        console.error('Error saving cart to localStorage:', error)
    }
}

// Thêm sản phẩm vào giỏ hàng
export const addProductToCart = (
    product: Product,
    quantity: number,
    selectedAttribute?: {
        name: string
        unit: string
        price: string
        image?: string
    }
): { success: boolean; message: string } => {
    try {
        const currentCart = getCartFromStorage()

        // Tính giá sản phẩm
        const currentPrice = selectedAttribute && selectedAttribute.price.length > 0
            ? +selectedAttribute.price[0]
            : product.product_basePrice

        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingItemIndex = currentCart.findIndex(item => {
            if (selectedAttribute) {
                return item.id === product._id &&
                    item.attribute?.name === selectedAttribute.name &&
                    item.attribute?.unit === selectedAttribute.unit
            }
            return item.id === product._id && !item.attribute
        })

        if (existingItemIndex !== -1) {
            // Cập nhật số lượng nếu sản phẩm đã tồn tại
            currentCart[existingItemIndex].quantity += quantity
            saveCartToStorage(currentCart)
            return {
                success: true,
                message: `Đã cập nhật số lượng ${product.product_name} trong giỏ hàng!`
            }
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            const newItem: CartItem = {
                id: product._id,
                name: product.product_name,
                price: currentPrice,
                quantity: quantity,
                image: product.product_thumb,
                slug: product.product_slug,
                attribute: selectedAttribute ? {
                    name: selectedAttribute.name,
                    unit: selectedAttribute.unit,
                    price: +selectedAttribute.price,
                    image: selectedAttribute.image
                } : undefined
            }

            currentCart.push(newItem)
            saveCartToStorage(currentCart)
            return {
                success: true,
                message: `Đã thêm ${product.product_name} vào giỏ hàng!`
            }
        }
    } catch (error) {
        console.error('Error adding product to cart:', error)
        return {
            success: false,
            message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!'
        }
    }
}

// Xóa sản phẩm khỏi giỏ hàng
export const removeProductFromCart = (productId: string, attribute?: { name: string; unit: string }): boolean => {
    try {
        const currentCart = getCartFromStorage()
        const filteredCart = currentCart.filter(item => {
            if (attribute) {
                return !(item.id === productId &&
                    item.attribute?.name === attribute.name &&
                    item.attribute?.unit === attribute.unit)
            }
            return !(item.id === productId && !item.attribute)
        })

        saveCartToStorage(filteredCart)
        return true
    } catch (error) {
        console.error('Error removing product from cart:', error)
        return false
    }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = (
    productId: string,
    newQuantity: number,
    attribute?: { name: string; unit: string }
): boolean => {
    try {
        if (newQuantity <= 0) {
            return removeProductFromCart(productId, attribute)
        }

        const currentCart = getCartFromStorage()
        const itemIndex = currentCart.findIndex(item => {
            if (attribute) {
                return item.id === productId &&
                    item.attribute?.name === attribute.name &&
                    item.attribute?.unit === attribute.unit
            }
            return item.id === productId && !item.attribute
        })

        if (itemIndex !== -1) {
            currentCart[itemIndex].quantity = newQuantity
            saveCartToStorage(currentCart)
            return true
        }
        return false
    } catch (error) {
        console.error('Error updating cart item quantity:', error)
        return false
    }
}

// Xóa toàn bộ giỏ hàng
export const clearCart = (): boolean => {
    try {
        localStorage.removeItem('tea_cart')
        // Dispatch custom event để thông báo cart đã được cập nhật
        window.dispatchEvent(new CustomEvent('cartUpdated'))
        return true
    } catch (error) {
        console.error('Error clearing cart:', error)
        return false
    }
}

// Lấy tổng số lượng sản phẩm trong giỏ hàng
export const getCartItemCount = (): number => {
    try {
        const cart = getCartFromStorage()
        return cart.reduce((total, item) => total + item.quantity, 0)
    } catch (error) {
        console.error('Error getting cart item count:', error)
        return 0
    }
}

// Lấy tổng giá trị giỏ hàng
export const getCartTotal = (): number => {
    try {
        const cart = getCartFromStorage()
        return cart.reduce((total, item) => total + (item.attribute ? item.attribute.price * item.quantity : item.price * item.quantity), 0)
    } catch (error) {
        console.error('Error getting cart total:', error)
        return 0
    }
}
