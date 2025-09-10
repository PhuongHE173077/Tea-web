import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface CartSummaryProps {
    total: number
    formatPrice: (price: number) => string
}

export default function CartSummary({ total, formatPrice }: CartSummaryProps) {
    return (
        <div className="lg:col-span-1">
            <Card style={{ backgroundColor: 'hsl(45, 36%, 92%)' }}>
                <CardHeader>
                    <CardTitle className="text-lg">TỔNG GIỎ HÀNG</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span className="text-red-500 font-medium">{formatPrice(total)}</span>
                    </div>

                    <div className="space-y-3">
                        <div className="font-medium">Giao hàng</div>
                        <RadioGroup
                            value={'paid'}
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paid" id="paid" />
                                <Label htmlFor="paid" className="text-sm">
                                    Đồng giá: 30.000 ₫
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="free" id="free" />
                                <Label htmlFor="free" className="text-sm">
                                    Giao hàng miễn phí với đơn hàng trên 2.000.000 đồng
                                </Label>
                            </div>
                        </RadioGroup>

                        <button className="text-blue-600 text-sm hover:underline">
                            Đổi địa chỉ
                        </button>
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-4 border-t">
                        <span>Tổng</span>
                        <span className="text-red-500">{formatPrice(total + 30000)}</span>
                    </div>

                    <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium"
                    >
                        TIẾN HÀNH THANH TOÁN
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
