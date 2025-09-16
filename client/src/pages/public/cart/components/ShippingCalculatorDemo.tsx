import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calculator, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import { shipService } from '@/services/ship.service';

/**
 * Demo component để test tính năng tính phí ship
 * Có thể sử dụng để test API trước khi tích hợp vào CartSummary
 */
const ShippingCalculatorDemo: React.FC = () => {
    const [orderValue, setOrderValue] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleCalculate = async () => {
        const value = parseInt(orderValue.replace(/\D/g, '')) || 0;
        
        if (value <= 0) {
            toast.error('Vui lòng nhập giá trị đơn hàng hợp lệ');
            return;
        }

        try {
            setLoading(true);
            const response = await shipService.calculateShippingFee({ orderValue: value });
            setResult(response.data);
            toast.success('Tính phí ship thành công!');
        } catch (error: any) {
            console.error('Error calculating shipping:', error);
            toast.error('Không thể tính phí ship: ' + (error?.response?.data?.message || error.message));
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (value: string) => {
        // Remove all non-digit characters
        const numericValue = value.replace(/\D/g, '');
        // Format with thousand separators
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setOrderValue(formattedValue);
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Demo tính phí ship
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="orderValue">Giá trị đơn hàng (VNĐ)</Label>
                        <Input
                            id="orderValue"
                            type="text"
                            placeholder="Ví dụ: 500,000"
                            value={orderValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                        />
                    </div>

                    <Button 
                        onClick={handleCalculate}
                        disabled={loading || !orderValue}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Đang tính...
                            </>
                        ) : (
                            <>
                                <Truck className="w-4 h-4 mr-2" />
                                Tính phí ship
                            </>
                        )}
                    </Button>

                    {result && (
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900">Kết quả:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Giá trị đơn hàng:</span>
                                    <span className="font-medium">{formatCurrency(result.orderValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ngưỡng miễn phí:</span>
                                    <span className="font-medium">{formatCurrency(result.freeShippingThreshold)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí ship:</span>
                                    <span className={`font-medium ${result.isFreeShipping ? 'text-green-600' : 'text-blue-600'}`}>
                                        {result.isFreeShipping ? 'Miễn phí' : formatCurrency(result.shippingFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-medium">Tổng thanh toán:</span>
                                    <span className="font-bold text-red-600">{formatCurrency(result.totalAmount)}</span>
                                </div>
                                {result.isFreeShipping && (
                                    <div className="text-green-600 text-center font-medium">
                                        🎉 Chúc mừng! Bạn được miễn phí giao hàng
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 space-y-1">
                        <p>💡 <strong>Cách sử dụng:</strong></p>
                        <p>1. Nhập giá trị đơn hàng</p>
                        <p>2. Nhấn "Tính phí ship" để xem kết quả</p>
                        <p>3. Hệ thống sẽ tự động tính phí dựa trên cấu hình admin</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShippingCalculatorDemo;
