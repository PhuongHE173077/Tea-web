import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import { SelectedProductAttribute } from '../types'

interface ProductAttributeDialogProps {
    isOpen: boolean
    onClose: () => void
    product: Product
    onConfirm: (selectedAttributes: SelectedProductAttribute[], finalPrice: number) => void
}

export default function ProductAttributeDialog({
    isOpen,
    onClose,
    product,
    onConfirm
}: ProductAttributeDialogProps) {
    const [selectedAttributes, setSelectedAttributes] = useState<SelectedProductAttribute[]>([])
    const [finalPrice, setFinalPrice] = useState(product.product_basePrice)

    // Reset state khi dialog mở
    useEffect(() => {
        if (isOpen) {
            setSelectedAttributes([])
            setFinalPrice(product.product_basePrice)
        }
    }, [isOpen, product])

    // Tính toán giá cuối cùng khi thuộc tính thay đổi
    useEffect(() => {
        if (selectedAttributes.length > 0) {
            // Nếu có thuộc tính được chọn, lấy giá của thuộc tính cuối cùng được chọn
            const lastSelectedAttribute = selectedAttributes[selectedAttributes.length - 1]
            setFinalPrice(lastSelectedAttribute.price)
        } else {
            // Nếu không có thuộc tính nào được chọn, dùng giá gốc
            setFinalPrice(product.product_basePrice)
        }
    }, [selectedAttributes, product.product_basePrice])

    // Xử lý chọn thuộc tính
    const handleAttributeSelect = (attribute: any) => {
        const isSelected = selectedAttributes.some(attr => attr.name === attribute.name)

        if (isSelected) {
            // Bỏ chọn thuộc tính
            setSelectedAttributes(prev => prev.filter(attr => attr.name !== attribute.name))
        } else {
            // Chọn thuộc tính
            setSelectedAttributes(prev => [...prev, {
                name: attribute.name,
                unit: attribute.unit,
                price: attribute.price,
                image: attribute.image
            }])
        }
    }

    // Kiểm tra thuộc tính đã được chọn
    const isAttributeSelected = (attributeName: string) => {
        return selectedAttributes.some(attr => attr.name === attributeName)
    }

    // Format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Xử lý xác nhận
    const handleConfirm = () => {
        onConfirm(selectedAttributes, finalPrice)
        onClose()
    }

    // Tạo tên hiển thị cho thuộc tính đã chọn
    const getAttributeDisplayName = () => {
        if (selectedAttributes.length === 0) return ''
        return selectedAttributes.map(attr => `${attr.name} (${attr.unit})`).join(', ')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <img
                            src={product.product_thumb}
                            alt={product.product_name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">{product.product_name}</h3>
                            <p className="text-sm text-gray-500">Chọn thuộc tính sản phẩm</p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Hiển thị giá gốc */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Giá gốc:</span>
                            <span className="font-medium">{formatPrice(product.product_basePrice)}</span>
                        </div>
                    </div>

                    {/* Danh sách thuộc tính */}
                    {product.product_attribute && product.product_attribute.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Thuộc tính có sẵn:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {product.product_attribute.map((attribute, index) => (
                                    <Card
                                        key={index}
                                        className={`cursor-pointer transition-all hover:shadow-md ${isAttributeSelected(attribute.name)
                                            ? 'ring-2 ring-blue-500 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => handleAttributeSelect(attribute)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {attribute.image && (
                                                        <img
                                                            src={attribute.image}
                                                            alt={attribute.name}
                                                            className="w-10 h-10 rounded object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <h5 className="font-medium">{attribute.name}</h5>
                                                        <p className="text-sm text-gray-500">{attribute.unit}</p>
                                                        <p className="text-sm font-medium text-blue-600">
                                                            {formatPrice(+attribute.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isAttributeSelected(attribute.name) && (
                                                    <Check className="w-5 h-5 text-blue-500" />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Sản phẩm này không có thuộc tính bổ sung</p>
                        </div>
                    )}

                    {/* Thuộc tính đã chọn */}
                    {selectedAttributes.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Thuộc tính đã chọn:</h4>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedAttributes.map((attr, index) => (
                                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                        {attr.name} ({attr.unit}) - {formatPrice(attr.price)}
                                        <X
                                            className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAttributeSelect(attr)
                                            }}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tổng giá */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-green-900">Tổng giá:</span>
                            <span className="text-lg font-bold text-green-600">{formatPrice(finalPrice)}</span>
                        </div>
                        {selectedAttributes.length > 0 && (
                            <div className="text-sm text-green-700 mt-1">
                                Giá gốc: {formatPrice(product.product_basePrice)} →
                                Giá thuộc tính: {formatPrice(finalPrice)}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirm}>
                        Thêm vào đơn hàng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
