import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Home, Search } from 'lucide-react'

interface OrderSuccessState {
    orderId: string
    trackingNumber: string
    total: number
}

export default function OrderSuccessPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const orderState = location.state as OrderSuccessState

    useEffect(() => {
        // If no order state, redirect to home
        if (!orderState) {
            navigate('/')
            return
        }
    }, [navigate, orderState])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    if (!orderState) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardHeader className="pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-green-600 mb-2">
                            Đặt hàng thành công!
                        </CardTitle>
                        <p className="text-gray-600">
                            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Order Information */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Mã đơn hàng:</span>
                                <span className="font-mono text-lg font-bold text-blue-600">
                                    #{orderState.trackingNumber}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Tổng tiền:</span>
                                <span className="text-lg font-bold text-red-500">
                                    {formatPrice(orderState.total)}
                                </span>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="text-left space-y-4">
                            <h3 className="font-semibold text-lg">Các bước tiếp theo:</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-blue-600">1</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Xác nhận đơn hàng</p>
                                        <p className="text-sm text-gray-600">
                                            Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-blue-600">2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Chuẩn bị hàng</p>
                                        <p className="text-sm text-gray-600">
                                            Đơn hàng sẽ được chuẩn bị và đóng gói cẩn thận
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-blue-600">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Giao hàng</p>
                                        <p className="text-sm text-gray-600">
                                            Đơn hàng sẽ được giao trong vòng 1-3 ngày làm việc
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-blue-50 rounded-lg p-4 text-left">
                            <h4 className="font-semibold mb-2">Thông tin liên hệ:</h4>
                            <div className="space-y-1 text-sm">
                                <p><strong>Hotline:</strong> 1900 1234</p>
                                <p><strong>Email:</strong> support@tea-shop.com</p>
                                <p><strong>Giờ làm việc:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                onClick={() => navigate(`/order-tracking?tracking=${orderState.trackingNumber}`)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Tra cứu đơn hàng
                            </Button>
                            
                            <Button
                                onClick={() => navigate('/products')}
                                variant="outline"
                                className="flex-1"
                            >
                                <Package className="w-4 h-4 mr-2" />
                                Tiếp tục mua sắm
                            </Button>
                            
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="flex-1"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Về trang chủ
                            </Button>
                        </div>

                        {/* Additional Information */}
                        <div className="text-sm text-gray-500 pt-4 border-t">
                            <p>
                                Bạn có thể tra cứu trạng thái đơn hàng bất cứ lúc nào bằng mã đơn hàng: 
                                <strong className="text-blue-600"> #{orderState.trackingNumber}</strong>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
