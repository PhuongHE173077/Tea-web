"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "react-toastify"

interface UpdateDiscountDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    discount: Discount
    onUpdate: (discount: Discount) => Promise<void>
}

export default function UpdateDiscountDialog({ open, setOpen, discount, onUpdate }: UpdateDiscountDialogProps) {
    const [formData, setFormData] = useState<DiscountFormData>({
        code: "",
        name: "",
        description: "",
        discount_type: "percentage",
        discount_value: 0,
        min_order_value: 0,
        max_discount_amount: undefined,
        start_date: "",
        end_date: "",
        usage_limit: 1,
        is_active: true,
    })

    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    // Pre-fill form data when discount changes
    useEffect(() => {
        if (discount) {
            setFormData({
                code: discount.code,
                name: discount.name,
                description: discount.description,
                discount_type: discount.discount_type,
                discount_value: discount.discount_value,
                min_order_value: discount.min_order_value,
                max_discount_amount: discount.max_discount_amount,
                start_date: discount.start_date,
                end_date: discount.end_date,
                usage_limit: discount.usage_limit,
                is_active: discount.is_active,
            })
            setStartDate(new Date(discount.start_date))
            setEndDate(new Date(discount.end_date))
        }
    }, [discount])

    const handleChange = (field: keyof DiscountFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        // Không cho phép thay đổi code nếu đã có người sử dụng
        if (discount.used_count > 0 && formData.code !== discount.code) {
            newErrors.code = "Không thể thay đổi mã giảm giá đã được sử dụng"
        } else if (!formData.code.trim()) {
            newErrors.code = "Mã giảm giá là bắt buộc"
        } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
            newErrors.code = "Mã giảm giá chỉ được chứa chữ hoa và số"
        } else if (formData.code.length < 3 || formData.code.length > 20) {
            newErrors.code = "Mã giảm giá phải từ 3-20 ký tự"
        }

        if (!formData.name.trim()) {
            newErrors.name = "Tên chương trình là bắt buộc"
        } else if (formData.name.length < 3 || formData.name.length > 100) {
            newErrors.name = "Tên chương trình phải từ 3-100 ký tự"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Mô tả là bắt buộc"
        } else if (formData.description.length < 10 || formData.description.length > 500) {
            newErrors.description = "Mô tả phải từ 10-500 ký tự"
        }

        if (formData.discount_value <= 0) {
            newErrors.discount_value = "Giá trị giảm giá phải lớn hơn 0"
        } else if (formData.discount_type === "percentage" && formData.discount_value > 100) {
            newErrors.discount_value = "Giá trị phần trăm không được vượt quá 100%"
        }

        if (formData.min_order_value < 0) {
            newErrors.min_order_value = "Giá trị đơn hàng tối thiểu không được âm"
        }

        if (formData.discount_type === "percentage" && !formData.max_discount_amount) {
            newErrors.max_discount_amount = "Số tiền giảm tối đa là bắt buộc cho giảm giá theo phần trăm"
        } else if (formData.max_discount_amount && formData.max_discount_amount <= 0) {
            newErrors.max_discount_amount = "Số tiền giảm tối đa phải lớn hơn 0"
        }

        if (!startDate) {
            newErrors.start_date = "Ngày bắt đầu là bắt buộc"
        }

        if (!endDate) {
            newErrors.end_date = "Ngày kết thúc là bắt buộc"
        } else if (startDate && endDate <= startDate) {
            newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu"
        }

        if (formData.usage_limit < 1) {
            newErrors.usage_limit = "Số lần sử dụng tối đa phải ít nhất là 1"
        } else if (formData.usage_limit < discount.used_count) {
            newErrors.usage_limit = `Số lần sử dụng tối đa không thể nhỏ hơn số lần đã sử dụng (${discount.used_count})`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin")
            return
        }

        setIsLoading(true)
        try {
            const submitData = {
                ...formData,
                code: formData.code.toUpperCase(),
                start_date: startDate!.toISOString(),
                end_date: endDate!.toISOString(),
            }

            const updatedDiscount: Discount = {
                ...discount,
                ...submitData,
                updatedAt: new Date().toISOString(),
            }

            await onUpdate(updatedDiscount)
        } catch (error: any) {
            // Error is already handled in parent component
        } finally {
            setIsLoading(false)
        }
    }

    const isCodeDisabled = discount.used_count > 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật mã giảm giá</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin mã giảm giá. {isCodeDisabled && "Lưu ý: Không thể thay đổi mã đã được sử dụng."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    {/* Mã giảm giá */}
                    <div className="space-y-2">
                        <Label htmlFor="code">Mã giảm giá *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                            placeholder="VD: SUMMER2024"
                            className={errors.code ? "border-red-500" : ""}
                            disabled={isCodeDisabled}
                        />
                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        {isCodeDisabled && (
                            <p className="text-sm text-amber-600">
                                Đã sử dụng {discount.used_count}/{discount.usage_limit} lần
                            </p>
                        )}
                    </div>

                    {/* Tên chương trình */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên chương trình *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="VD: Giảm giá mùa hè"
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Mô tả *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Mô tả chi tiết về chương trình giảm giá..."
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {/* Loại giảm giá */}
                    <div className="space-y-2">
                        <Label>Loại giảm giá *</Label>
                        <Select
                            value={formData.discount_type}
                            onValueChange={(value) => handleChange("discount_type", value as "percentage" | "fixed_amount")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Theo phần trăm (%)</SelectItem>
                                <SelectItem value="fixed_amount">Số tiền cố định (VND)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Giá trị giảm */}
                    <div className="space-y-2">
                        <Label htmlFor="discount_value">
                            Giá trị giảm * {formData.discount_type === "percentage" ? "(%)" : "(VND)"}
                        </Label>
                        <Input
                            id="discount_value"
                            type="number"
                            value={formData.discount_value}
                            onChange={(e) => handleChange("discount_value", Number(e.target.value))}
                            placeholder={formData.discount_type === "percentage" ? "VD: 20" : "VD: 50000"}
                            className={errors.discount_value ? "border-red-500" : ""}
                        />
                        {errors.discount_value && <p className="text-sm text-red-500">{errors.discount_value}</p>}
                    </div>

                    {/* Giá trị đơn hàng tối thiểu */}
                    <div className="space-y-2">
                        <Label htmlFor="min_order_value">Giá trị đơn hàng tối thiểu (VND)</Label>
                        <Input
                            id="min_order_value"
                            type="number"
                            value={formData.min_order_value}
                            onChange={(e) => handleChange("min_order_value", Number(e.target.value))}
                            placeholder="VD: 500000"
                            className={errors.min_order_value ? "border-red-500" : ""}
                        />
                        {errors.min_order_value && <p className="text-sm text-red-500">{errors.min_order_value}</p>}
                    </div>

                    {/* Số tiền giảm tối đa */}
                    {formData.discount_type === "percentage" && (
                        <div className="space-y-2">
                            <Label htmlFor="max_discount_amount">Số tiền giảm tối đa (VND) *</Label>
                            <Input
                                id="max_discount_amount"
                                type="number"
                                value={formData.max_discount_amount || ""}
                                onChange={(e) => handleChange("max_discount_amount", Number(e.target.value) || undefined)}
                                placeholder="VD: 100000"
                                className={errors.max_discount_amount ? "border-red-500" : ""}
                            />
                            {errors.max_discount_amount && <p className="text-sm text-red-500">{errors.max_discount_amount}</p>}
                        </div>
                    )}

                    {/* Ngày bắt đầu */}
                    <div className="space-y-2">
                        <Label>Ngày bắt đầu *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${errors.start_date ? "border-red-500" : ""}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                    </div>

                    {/* Ngày kết thúc */}
                    <div className="space-y-2">
                        <Label>Ngày kết thúc *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${errors.end_date ? "border-red-500" : ""}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    disabled={(date) => date < (startDate || new Date())}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                    </div>

                    {/* Số lần sử dụng tối đa */}
                    <div className="space-y-2">
                        <Label htmlFor="usage_limit">Số lần sử dụng tối đa *</Label>
                        <Input
                            id="usage_limit"
                            type="number"
                            value={formData.usage_limit}
                            onChange={(e) => handleChange("usage_limit", Number(e.target.value))}
                            placeholder="VD: 1000"
                            className={errors.usage_limit ? "border-red-500" : ""}
                        />
                        {errors.usage_limit && <p className="text-sm text-red-500">{errors.usage_limit}</p>}
                    </div>

                    {/* Trạng thái hoạt động */}
                    <div className="space-y-2">
                        <Label>Trạng thái</Label>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) => handleChange("is_active", checked)}
                            />
                            <span className="text-sm">
                                {formData.is_active ? "Hoạt động" : "Không hoạt động"}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="rounded-xl"
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="rounded-xl"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
