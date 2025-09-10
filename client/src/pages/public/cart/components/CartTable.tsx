import { Button } from "@/components/ui/button"
import { CartItem } from "@/utils/cart"
import { Trash2Icon } from "lucide-react"

interface CartTableProps {
    cartItems: CartItem[]
    formatPrice: (price: number) => string
    handleUpdateQuantity: (item: CartItem, newQuantity: number) => void
    handleRemoveItem: (item: CartItem) => void
    loadCartData: () => void
}

export default function CartTable({
    cartItems,
    formatPrice,
    handleUpdateQuantity,
    handleRemoveItem,
    loadCartData
}: CartTableProps) {
    return (
        <div className="space-y-6">
            {/* Header bảng */}
            <div className="grid grid-cols-12 gap-4 p-4 rounded-lg font-medium text-sm"
                style={{ backgroundColor: 'hsl(45, 36%, 92%)' }}>
                <div className="col-span-5">SẢN PHẨM</div>
                <div className="col-span-2 text-center">GIÁ</div>
                <div className="col-span-2 text-center">SỐ LƯỢNG</div>
                <div className="col-span-2 text-center">TẠM TÍNH</div>
                <div className="col-span-1"></div>
            </div>

            {/* Danh sách sản phẩm */}
            {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.attribute?.name || 'default'}-${index}`}
                    className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                    {/* Nút xóa và thông tin sản phẩm */}
                    <div className="col-span-5 flex items-center gap-3">

                        <div className="w-16 h-16 flex-shrink-0">
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                        <div>
                            <div className="font-medium text-blue-600">{item.name}</div>
                            {item.attribute ?
                                <div className="text-sm text-gray-500 italic">{item.attribute?.name === "package" ? "Túi" : "Hộp"} {item.attribute?.unit}</div>

                                : <div className="text-sm text-gray-500 italic">{item.name}</div>
                            }
                        </div>
                    </div>

                    {/* Giá */}
                    <div className="col-span-2 text-center text-red-500 font-medium">
                        {
                            item.attribute ? formatPrice(item.attribute.price) : formatPrice(item.price)
                        }
                    </div>

                    {/* Số lượng */}
                    <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            >
                                -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                                className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Tạm tính */}
                    <div className="col-span-2 text-center text-red-500 font-medium">
                        {
                            item.attribute ? formatPrice(item.attribute.price * item.quantity) : formatPrice(item.price * item.quantity)
                        }
                    </div>
                    <div className="col-span-1">
                        <button
                            className="text-red-500 hover:text-red-700 hover:bg-white text-lg border rounded-sm p-2 font-bold"
                            onClick={() => handleRemoveItem(item)}
                        >
                            <Trash2Icon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}


        </div>
    )
}
