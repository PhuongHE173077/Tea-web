import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, DollarSign, Target, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import { shipService } from '@/services/ship.service';
import { CreateShipConfigRequest, ShipConfigFormErrors } from '@/types/ship';

const CreateShipConfig: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateShipConfigRequest>({
        freeShippingThreshold: 0,
        shippingFee: 0,
        isActive: true,
        description: '',
    });
    const [errors, setErrors] = useState<ShipConfigFormErrors>({});

    // Handle input change
    const handleInputChange = (field: keyof CreateShipConfigRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as keyof ShipConfigFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: ShipConfigFormErrors = {};

        // Validate free shipping threshold
        if (formData.freeShippingThreshold < 0) {
            newErrors.freeShippingThreshold = 'Ngưỡng miễn phí ship phải >= 0';
        }

        // Validate shipping fee
        if (formData.shippingFee < 0) {
            newErrors.shippingFee = 'Phí ship phải >= 0';
        }

        // Validate description length
        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
            return;
        }

        try {
            setLoading(true);
            await shipService.createShipConfig(formData);
            toast.success('Tạo cấu hình phí ship thành công!');
            navigate('/admin/ship');
        } catch (error: any) {
            console.error('Error creating ship config:', error);
            const errorMessage = error?.response?.data?.message || 'Không thể tạo cấu hình phí ship';
            toast.error(errorMessage);

            // Handle validation errors from server
            if (error?.response?.status === 400 && error?.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    // Format currency input
    const formatCurrencyInput = (value: string): number => {
        // Remove all non-digit characters
        const numericValue = value.replace(/\D/g, '');
        return parseInt(numericValue) || 0;
    };

    // Format currency display
    const formatCurrencyDisplay = (amount: number): string => {
        return amount.toLocaleString('vi-VN');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/ship')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Truck className="w-8 h-8 text-blue-600" />
                        Tạo cấu hình phí ship mới
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Thiết lập ngưỡng miễn phí ship và mức phí vận chuyển
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Thông tin cơ bản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Free Shipping Threshold */}
                                <div className="space-y-2">
                                    <Label htmlFor="freeShippingThreshold" className="flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Ngưỡng miễn phí ship (VNĐ) *
                                    </Label>
                                    <Input
                                        id="freeShippingThreshold"
                                        type="text"
                                        placeholder="Ví dụ: 500000"
                                        value={formatCurrencyDisplay(formData.freeShippingThreshold)}
                                        onChange={(e) => handleInputChange('freeShippingThreshold', formatCurrencyInput(e.target.value))}
                                        className={errors.freeShippingThreshold ? 'border-red-500' : ''}
                                    />
                                    {errors.freeShippingThreshold && (
                                        <p className="text-sm text-red-600">{errors.freeShippingThreshold}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Đơn hàng có giá trị từ {formatCurrencyDisplay(formData.freeShippingThreshold)} VNĐ trở lên sẽ được miễn phí ship
                                    </p>
                                </div>

                                {/* Shipping Fee */}
                                <div className="space-y-2">
                                    <Label htmlFor="shippingFee" className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        Phí ship (VNĐ) *
                                    </Label>
                                    <Input
                                        id="shippingFee"
                                        type="text"
                                        placeholder="Ví dụ: 30000"
                                        value={formatCurrencyDisplay(formData.shippingFee)}
                                        onChange={(e) => handleInputChange('shippingFee', formatCurrencyInput(e.target.value))}
                                        className={errors.shippingFee ? 'border-red-500' : ''}
                                    />
                                    {errors.shippingFee && (
                                        <p className="text-sm text-red-600">{errors.shippingFee}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Phí ship áp dụng cho đơn hàng có giá trị dưới ngưỡng miễn phí
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Mô tả
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Mô tả về cấu hình phí ship này..."
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {formData.description?.length || 0}/500 ký tự
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang tạo...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Tạo cấu hình
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => navigate('/admin/ship')}
                                        disabled={loading}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="isActive">Kích hoạt ngay</Label>
                                        <p className="text-sm text-gray-500">
                                            Cấu hình sẽ được áp dụng ngay lập tức
                                        </p>
                                    </div>
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                    />
                                </div>
                                {formData.isActive && (
                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            ⚠️ Khi kích hoạt, tất cả cấu hình khác sẽ tự động bị vô hiệu hóa
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Xem trước</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Ngưỡng miễn phí:</span>
                                        <span className="font-medium">
                                            {formatCurrencyDisplay(formData.freeShippingThreshold)} VNĐ
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Phí ship:</span>
                                        <span className="font-medium">
                                            {formatCurrencyDisplay(formData.shippingFee)} VNĐ
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Trạng thái:</span>
                                        <span className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                            {formData.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                        </span>
                                    </div>
                                </div>

                                {/* Example calculations */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Ví dụ tính phí:</h4>
                                    <div className="text-xs space-y-1">
                                        <div className="flex justify-between">
                                            <span>Đơn hàng 200,000 VNĐ:</span>
                                            <span className="font-medium">
                                                {formData.freeShippingThreshold > 200000
                                                    ? `+${formatCurrencyDisplay(formData.shippingFee)} VNĐ`
                                                    : 'Miễn phí'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Đơn hàng {formatCurrencyDisplay(formData.freeShippingThreshold)} VNĐ:</span>
                                            <span className="font-medium text-green-600">Miễn phí</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateShipConfig;
