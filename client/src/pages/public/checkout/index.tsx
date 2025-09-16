import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, ShoppingBag, CreditCard, Truck } from 'lucide-react'
import { toast } from 'react-toastify'
import { getCartFromStorage, clearCart, CartItem } from "@/utils/cart"
import { createOrderAPIs, CustomerInfo, CartItemForOrder } from "@/apis/order.apis"
import { AddressService, Province, District, Ward } from "@/services/address.service"

interface CheckoutState {
    cartTotal: number
    appliedDiscount: any
    shippingFee: number
    finalTotal: number
}

interface CheckoutFormData {
    name: string
    phone: string
    email: string
    province: string
    district: string
    ward: string
    street: string
    note: string
    payment_method: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
}

interface FormErrors {
    [key: string]: string
}

export default function CheckoutPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const checkoutState = location.state as CheckoutState

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<CheckoutFormData>({
        name: '',
        phone: '',
        email: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        note: '',
        payment_method: 'cod'
    })
    const [errors, setErrors] = useState<FormErrors>({})

    // Address data
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
    const [isLoadingWards, setIsLoadingWards] = useState(false)

    useEffect(() => {
        // Load cart items
        const items = getCartFromStorage()
        if (items.length === 0) {
            toast.error('Giỏ hàng trống')
            navigate('/cart')
            return
        }
        setCartItems(items)

        // If no checkout state, redirect back to cart
        if (!checkoutState) {
            toast.error('Vui lòng quay lại giỏ hàng để tiếp tục')
            navigate('/cart')
            return
        }

        // Load provinces
        loadProvinces()
    }, [navigate, checkoutState])

    const loadProvinces = async () => {
        setIsLoadingProvinces(true)
        try {
            const provincesData = await AddressService.getProvincesWithCache()
            setProvinces(provincesData)
        } catch (error) {
            console.error('Error loading provinces:', error)
            toast.error('Không thể tải danh sách tỉnh/thành phố')
        } finally {
            setIsLoadingProvinces(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Họ tên là bắt buộc'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Họ tên phải có ít nhất 2 ký tự'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc'
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Số điện thoại phải có 10-11 chữ số'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (!formData.province.trim()) {
            newErrors.province = 'Vui lòng chọn tỉnh/thành phố'
        }

        if (!formData.district.trim()) {
            newErrors.district = 'Vui lòng chọn quận/huyện'
        }

        if (!formData.ward.trim()) {
            newErrors.ward = 'Vui lòng chọn phường/xã'
        }

        if (!formData.street.trim()) {
            newErrors.street = 'Địa chỉ cụ thể là bắt buộc'
        } else if (formData.street.trim().length < 5) {
            newErrors.street = 'Địa chỉ cụ thể phải có ít nhất 5 ký tự'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleProvinceChange = async (provinceCode: string) => {
        const province = provinces.find(p => p.code === provinceCode)
        if (province) {
            setSelectedProvince(province)
            setFormData(prev => ({
                ...prev,
                province: provinceCode,
                district: '', // Reset district when province changes
                ward: '' // Reset ward when province changes
            }))
            setSelectedDistrict(null)
            setSelectedWard(null)
            setWards([])

            // Clear errors
            if (errors.province) {
                setErrors(prev => ({ ...prev, province: '' }))
            }
            if (errors.district) {
                setErrors(prev => ({ ...prev, district: '' }))
            }
            if (errors.ward) {
                setErrors(prev => ({ ...prev, ward: '' }))
            }

            // Load districts for selected province
            await loadDistricts(provinceCode)
        }
    }

    const loadDistricts = async (provinceCode: string) => {
        setIsLoadingDistricts(true)
        try {
            const districtsData = await AddressService.getDistrictsByProvinceCode(provinceCode)
            setDistricts(districtsData)
        } catch (error) {
            console.error('Error loading districts:', error)
            toast.error('Không thể tải danh sách quận/huyện')
            setDistricts([])
        } finally {
            setIsLoadingDistricts(false)
        }
    }

    const handleDistrictChange = async (districtCode: string) => {
        const district = districts.find(d => d.code === districtCode)
        if (district) {
            setSelectedDistrict(district)
            setFormData(prev => ({
                ...prev,
                district: districtCode,
                ward: '' // Reset ward when district changes
            }))
            setSelectedWard(null)

            // Clear error
            if (errors.district) {
                setErrors(prev => ({ ...prev, district: '' }))
            }
            if (errors.ward) {
                setErrors(prev => ({ ...prev, ward: '' }))
            }

            // Load wards for selected district
            await loadWards(districtCode)
        }
    }

    const handleWardChange = (wardCode: string) => {
        const ward = wards.find(w => w.code === wardCode)
        if (ward) {
            setSelectedWard(ward)
            setFormData(prev => ({
                ...prev,
                ward: wardCode
            }))

            // Clear errors
            if (errors.ward) {
                setErrors(prev => ({ ...prev, ward: '' }))
            }
        }
    }

    const loadWards = async (districtCode: string) => {
        setIsLoadingWards(true)
        try {
            const wardsData = await AddressService.getWardsByDistrictCode(districtCode)
            setWards(wardsData)
        } catch (error) {
            console.error('Error loading wards:', error)
            toast.error('Không thể tải danh sách phường/xã')
            setWards([])
        } finally {
            setIsLoadingWards(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin')
            return
        }

        setIsLoading(true)

        try {
            // Prepare customer info
            const fullAddress = AddressService.formatFullAddress(
                selectedProvince?.name || formData.province,
                selectedDistrict?.name || formData.district,
                selectedWard?.name || formData.ward,
                formData.street.trim()
            )

            const customerInfo: CustomerInfo = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim().toLowerCase(),
                address: fullAddress,
                note: formData.note.trim()
            }

            // Convert cart items to order format
            const cartItemsForOrder: CartItemForOrder[] = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                slug: item.slug,
                image: item.image,
                price: item.attribute ? item.attribute.price : item.price,
                quantity: item.quantity,
                attribute: item.attribute ? {
                    name: item.attribute.name,
                    unit: item.attribute.unit,
                    price: item.attribute.price
                } : undefined
            }))

            // Create order with structured shipping address
            const response = await createOrderAPIs({
                customer_info: customerInfo,
                cart_items: cartItemsForOrder,
                discount_code: checkoutState.appliedDiscount?.code || undefined,
                shipping_address: {
                    province: {
                        code: selectedProvince?.code || formData.province,
                        name: selectedProvince?.name || formData.province
                    },
                    district: {
                        code: selectedDistrict?.code || formData.district,
                        name: selectedDistrict?.name || formData.district
                    },
                    ward: {
                        code: selectedWard?.code || formData.ward,
                        name: selectedWard?.name || formData.ward
                    },
                    street: formData.street.trim(),
                    full_address: fullAddress
                },
                payment_method: formData.payment_method
            })

            if (response.data.success) {
                // Clear cart after successful order
                clearCart()
                
                toast.success('Đặt hàng thành công!')
                
                // Navigate to order success page
                navigate('/order-success', {
                    state: {
                        orderId: response.data.data.order_id,
                        trackingNumber: response.data.data.tracking_number,
                        total: response.data.data.total
                    }
                })
            }
        } catch (error: any) {
            console.error('Order creation failed:', error)
            
            let errorMessage = 'Có lỗi xảy ra khi đặt hàng'
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            }
            
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (!checkoutState || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Đang tải...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại giỏ hàng
                </Button>
                <h1 className="text-2xl font-bold">Thanh toán</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Thông tin giao hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Họ và tên *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="phone">Số điện thoại *</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className={errors.phone ? 'border-red-500' : ''}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Nhập địa chỉ email"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Province Selection */}
                                <div>
                                    <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                                    <Select
                                        value={formData.province}
                                        onValueChange={handleProvinceChange}
                                        disabled={isLoadingProvinces}
                                    >
                                        <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={
                                                isLoadingProvinces
                                                    ? "Đang tải..."
                                                    : "Chọn tỉnh/thành phố"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinces.map((province) => (
                                                <SelectItem key={province.code} value={province.code}>
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.province && (
                                        <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                                    )}
                                </div>

                                {/* District Selection */}
                                <div>
                                    <Label htmlFor="district">Quận/Huyện *</Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={handleDistrictChange}
                                        disabled={!formData.province || isLoadingDistricts}
                                    >
                                        <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={
                                                !formData.province
                                                    ? "Vui lòng chọn tỉnh/thành phố trước"
                                                    : isLoadingDistricts
                                                    ? "Đang tải..."
                                                    : "Chọn quận/huyện"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map((district) => (
                                                <SelectItem key={district.code} value={district.code}>
                                                    {district.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.district && (
                                        <p className="text-sm text-red-500 mt-1">{errors.district}</p>
                                    )}
                                </div>

                                {/* Ward Selection */}
                                <div>
                                    <Label htmlFor="ward">Phường/Xã *</Label>
                                    <Select
                                        value={formData.ward}
                                        onValueChange={handleWardChange}
                                        disabled={!formData.district || isLoadingWards}
                                    >
                                        <SelectTrigger className={errors.ward ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={
                                                !formData.district
                                                    ? "Vui lòng chọn quận/huyện trước"
                                                    : isLoadingWards
                                                    ? "Đang tải..."
                                                    : "Chọn phường/xã"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wards.map((ward) => (
                                                <SelectItem key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.ward && (
                                        <p className="text-sm text-red-500 mt-1">{errors.ward}</p>
                                    )}
                                </div>

                                {/* Street Address */}
                                <div>
                                    <Label htmlFor="street">Địa chỉ cụ thể *</Label>
                                    <Textarea
                                        id="street"
                                        value={formData.street}
                                        onChange={(e) => handleInputChange('street', e.target.value)}
                                        placeholder="Nhập số nhà, tên đường, phường/xã (ví dụ: 123 Nguyễn Trãi, Phường Thanh Xuân Nam)"
                                        rows={2}
                                        className={errors.street ? 'border-red-500' : ''}
                                    />
                                    {errors.street && (
                                        <p className="text-sm text-red-500 mt-1">{errors.street}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                                    <Textarea
                                        id="note"
                                        value={formData.note}
                                        onChange={(e) => handleInputChange('note', e.target.value)}
                                        placeholder="Ghi chú thêm cho đơn hàng (thời gian giao hàng, yêu cầu đặc biệt...)"
                                        rows={2}
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Phương thức thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={formData.payment_method}
                                onValueChange={(value) => handleInputChange('payment_method', value)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                    <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="momo" id="momo" />
                                    <Label htmlFor="momo">Ví MoMo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="vnpay" id="vnpay" />
                                    <Label htmlFor="vnpay">VNPay</Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Đơn hàng của bạn
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cart Items */}
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.attribute?.name || 'default'}`} className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            {item.attribute && (
                                                <p className="text-sm text-gray-600">
                                                    {item.attribute.name} - {item.attribute.unit}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Số lượng: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {formatPrice((item.attribute ? item.attribute.price : item.price) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(checkoutState.cartTotal)}</span>
                                </div>

                                {checkoutState.appliedDiscount && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá ({checkoutState.appliedDiscount.code})</span>
                                        <span>-{formatPrice(checkoutState.appliedDiscount.discount_amount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Phí vận chuyển</span>
                                    <span>{formatPrice(checkoutState.shippingFee)}</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Tổng cộng</span>
                                    <span className="text-red-500">{formatPrice(checkoutState.finalTotal)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đặt hàng'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
