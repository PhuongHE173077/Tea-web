import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Package, Truck, CheckCircle, Clock, XCircle, Phone, MapPin, CreditCard, Calendar, User } from 'lucide-react'
import { toast } from 'react-toastify'
import { trackOrderAPIs, OrderTrackingRequest, OrderData } from "@/apis/order.apis"
import { maskPhoneNumber, maskEmail, maskAddress, formatCurrency, formatDate } from '@/utils/privacy'

// Remove duplicate interface - using OrderData from APIs

const statusConfig = {
    pending: {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
    },
    confirmed: {
        label: 'Đã xác nhận',
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircle
    },
    processing: {
        label: 'Đang xử lý',
        color: 'bg-purple-100 text-purple-800',
        icon: Package
    },
    shipped: {
        label: 'Đang giao hàng',
        color: 'bg-orange-100 text-orange-800',
        icon: Truck
    },
    delivered: {
        label: 'Đã giao hàng',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
    },
    cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
    }
}

const paymentMethodLabels = {
    cod: 'Thanh toán khi nhận hàng',
    bank_transfer: 'Chuyển khoản ngân hàng',
    momo: 'Ví MoMo',
    vnpay: 'VNPay'
}

export default function OrderTrackingPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [trackingNumber, setTrackingNumber] = useState(searchParams.get('tracking') || '')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [ordersData, setOrdersData] = useState<OrderData[]>([])
    const [isMultipleOrders, setIsMultipleOrders] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const tracking = searchParams.get('tracking')
        if (tracking) {
            setTrackingNumber(tracking)
            handleSearch(tracking)
        }
    }, [])

    const getStatusColor = (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig]
        return config ? config.color : 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig]
        return config ? config.label : status
    }

    const getPaymentStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Chờ thanh toán'
            case 'paid':
                return 'Đã thanh toán'
            case 'failed':
                return 'Thanh toán thất bại'
            case 'refunded':
                return 'Đã hoàn tiền'
            default:
                return status
        }
    }

    const getPaymentMethodText = (method: string) => {
        return paymentMethodLabels[method as keyof typeof paymentMethodLabels] || method
    }

    const handleSearch = async (searchTrackingNumber?: string) => {
        const numberToSearch = searchTrackingNumber || trackingNumber

        if (!numberToSearch.trim() && !phoneNumber.trim()) {
            toast.error('Vui lòng nhập mã đơn hàng hoặc số điện thoại')
            return
        }

        setIsLoading(true)
        setOrderData(null)
        setOrdersData([])
        setIsMultipleOrders(false)

        try {
            const searchData: OrderTrackingRequest = {}

            if (numberToSearch.trim()) {
                searchData.trackingNumber = numberToSearch.trim()
            }

            if (phoneNumber.trim()) {
                searchData.phone = phoneNumber.trim()
            }

            console.log('🔍 Frontend - Sending request:', searchData)
            console.log('🔍 Frontend - API URL:', import.meta.env.VITE_APP_API_URL)

            const response = await trackOrderAPIs(searchData)

            console.log('🔍 Frontend - Response:', response)

            if (response.data.success && response.data.data) {
                if (response.data.data.isMultiple && response.data.data.orders) {
                    // Multiple orders (phone search)
                    setOrdersData(response.data.data.orders)
                    setIsMultipleOrders(true)
                    toast.success(`Tìm thấy ${response.data.data.orders.length} đơn hàng`)
                } else if (response.data.data.order) {
                    // Single order (tracking number search)
                    setOrderData(response.data.data.order)
                    setIsMultipleOrders(false)
                    toast.success('Tìm thấy thông tin đơn hàng')

                    // Update URL with tracking number if available
                    if (numberToSearch.trim()) {
                        setSearchParams({ tracking: numberToSearch.trim() })
                    }
                }
            } else {
                toast.error(response.data.message || 'Không tìm thấy đơn hàng')
            }
        } catch (error: any) {
            console.error('Order tracking error:', error)
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tra cứu đơn hàng'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch()
    }

    const handleReset = () => {
        setTrackingNumber('')
        setPhoneNumber('')
        setOrderData(null)
        setOrdersData([])
        setIsMultipleOrders(false)
        setSearchParams({})
    }

    // Component to render single order card
    const OrderCard = ({ order, isCompact = false }: { order: OrderData, isCompact?: boolean }) => {
        const StatusIcon = statusConfig[order.order_status as keyof typeof statusConfig]?.icon || Clock

        return (
            <Card className="w-full">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg font-semibold">
                                Đơn hàng #{order.order_trackingNumber}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Đặt hàng: {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.order_status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {getStatusText(order.order_status)}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Họ tên:</span>
                                    <span className="ml-2 font-medium">{order?.customer_info?.name || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span className="ml-2 font-medium">{order?.customer_info?.phone ? maskPhoneNumber(order.customer_info.phone) : 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Email:</span>
                                    <span className="ml-2 font-medium">{order?.customer_info?.email ? maskEmail(order.customer_info.email) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Địa chỉ giao hàng
                            </h3>
                            <div className="text-sm">
                                <p className="font-medium">
                                    {order?.order_shipping?.full_address ? maskAddress(order.order_shipping.full_address) : 'N/A'}
                                </p>
                                <div className="mt-2 text-gray-600 space-y-1">
                                    <p>Phường/Xã: {order?.order_shipping?.ward?.name || 'N/A'}</p>
                                    <p>Quận/Huyện: {order?.order_shipping?.district?.name || 'N/A'}</p>
                                    <p>Tỉnh/Thành phố: {order?.order_shipping?.province?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Thông tin đơn hàng
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="font-medium">{formatCurrency(order.order_checkout.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-medium">{formatCurrency(order.order_checkout.shipping_fee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giảm giá:</span>
                                    <span className="font-medium text-green-600">-{formatCurrency(order.order_checkout.discount_amount)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Tổng cộng:</span>
                                    <span className="text-primary">{formatCurrency(order.order_checkout.total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Thanh toán
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Phương thức:</span>
                                    <span className="ml-2 font-medium">{getPaymentMethodText(order.order_payment.method)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="ml-2 font-medium">{getPaymentStatusText(order.order_payment.status)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {order?.customer_info?.note && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Ghi chú</h3>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    {order.customer_info.note}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tra cứu đơn hàng</h1>
                    <p className="text-gray-600">
                        Nhập mã đơn hàng hoặc số điện thoại để tra cứu thông tin đơn hàng của bạn
                    </p>
                </div>

                {/* Search Form */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Thông tin tra cứu
                        </CardTitle>
                        <CardDescription>
                            Bạn có thể tra cứu bằng mã đơn hàng hoặc số điện thoại đã đặt hàng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="trackingNumber">Mã đơn hàng</Label>
                                    <Input
                                        id="trackingNumber"
                                        placeholder="Ví dụ: TRK1234567890"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                    <Input
                                        id="phoneNumber"
                                        placeholder="Ví dụ: 0123456789"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Đang tra cứu...
                                        </>
                                    ) : (
                                        'Tra cứu đơn hàng'
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                >
                                    Làm mới
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Order Results */}
                {isMultipleOrders && ordersData.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Tìm thấy {ordersData.length} đơn hàng
                            </h2>
                            <Badge variant="outline" className="text-sm">
                                {ordersData.length} đơn hàng
                            </Badge>
                        </div>

                        {/* Multiple Orders Grid */}
                        <div className="grid gap-6">
                            {ordersData.map((order) => (
                                <OrderCard key={order.order_id} order={order} isCompact={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Single Order Result */}
                {!isMultipleOrders && orderData && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Thông tin đơn hàng
                            </h2>
                        </div>

                        <OrderCard order={orderData} />
                    </div>
                )}

                {/* Legacy single order display - keeping for fallback */}
                {false && orderData && (
                    <div className="space-y-6">
                        {/* Order Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Thông tin đơn hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Mã đơn hàng</p>
                                        <p className="font-semibold">{orderData.order_trackingNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trạng thái</p>
                                        <Badge className={getStatusColor(orderData.order_status)}>
                                            {getStatusText(orderData.order_status)}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                                        <p className="font-semibold">{formatDate(orderData.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tổng tiền</p>
                                        <p className="font-semibold text-green-600">
                                            {formatCurrency(orderData.order_checkout.total)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Thông tin khách hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Họ tên</p>
                                        <p className="font-semibold">{orderData?.customer_info?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số điện thoại</p>
                                        <p className="font-semibold">{orderData?.customer_info?.phone ? maskPhoneNumber(orderData.customer_info.phone) : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{orderData?.customer_info?.email ? maskEmail(orderData.customer_info.email) : 'N/A'}</p>
                                    </div>
                                    {orderData?.customer_info?.note && (
                                        <div>
                                            <p className="text-sm text-gray-600">Ghi chú</p>
                                            <p className="font-semibold">{orderData.customer_info.note}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Địa chỉ giao hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold">
                                    {orderData?.order_shipping?.full_address ? maskAddress(orderData.order_shipping.full_address) : 'N/A'}
                                </p>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Phường/Xã: {orderData?.order_shipping?.ward?.name || 'N/A'}</p>
                                    <p>Quận/Huyện: {orderData?.order_shipping?.district?.name || 'N/A'}</p>
                                    <p>Tỉnh/Thành phố: {orderData?.order_shipping?.province?.name || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Thông tin thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                                            <p className="font-semibold">
                                                {getPaymentMethodText(orderData.order_payment.method)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                                            <Badge className={orderData.order_payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                                {getPaymentStatusText(orderData.order_payment.status)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Tạm tính:</span>
                                            <span>{formatCurrency(orderData.order_checkout.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí vận chuyển:</span>
                                            <span>{formatCurrency(orderData.order_checkout.shipping_fee)}</span>
                                        </div>
                                        {orderData.order_checkout.discount_amount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá:</span>
                                                <span>-{formatCurrency(orderData.order_checkout.discount_amount)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Tổng cộng:</span>
                                            <span className="text-green-600">
                                                {formatCurrency(orderData.order_checkout.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Help Section */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Cần hỗ trợ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Nếu bạn không tìm thấy thông tin đơn hàng hoặc cần hỗ trợ, vui lòng liên hệ:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>Hotline: 1900-xxxx</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Thời gian: 8:00 - 22:00 (T2-CN)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
