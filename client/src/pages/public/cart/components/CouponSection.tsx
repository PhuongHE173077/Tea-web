import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CouponSection() {
    return (
        <div className="flex gap-4 items-end">
            <div className="flex-1">
                <Input
                    placeholder="Coupon code"
                    className="border-gray-300"
                />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                Thêm mã giảm giá
            </Button>
        </div>
    )
}
