import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import InputNumber from "@/components/InputNumber"
import { ProductAdd } from "../types"
import { ProductAttribute } from "../types/enum"
import { useForm, Controller } from "react-hook-form"

interface DialogAddSkuProps {
    open: boolean
    setOpen: (state: boolean) => void
    product: ProductAdd
    setProduct: (product: ProductAdd) => void
}

type FormValues = {
    name: string
    unit: string
    price: number
    image: string
}

export default function DialogAddSku({
    open,
    setOpen,
    product,
    setProduct,
}: DialogAddSkuProps) {
    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            name: "",
            unit: "",
            price: 0,
            image: "",
        },
    })

    const onSubmit = (data: FormValues) => {
        setProduct({
            ...product,
            product_attribute: [...product.product_attribute, data],
        })
        reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm SKU mới</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Select loại hàng */}
                    <div className="space-y-2">
                        <Label>Loại hàng</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại hàng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ProductAttribute.BOX}>Hộp</SelectItem>
                                        <SelectItem value={ProductAttribute.PACKAGE}>Túi</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Khối lượng */}
                    <div className="space-y-2">
                        <Label>Khối lượng </Label>
                        <Controller
                            name="unit"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Nhập khối lượng"
                                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            )}
                        />
                    </div>

                    {/* Nhập giá */}
                    <div className="space-y-2">
                        <Label>Giá</Label>
                        <Controller
                            name="price"
                            control={control}
                            rules={{ required: true }}

                            render={({ field }) => (
                                <InputNumber value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </div>

                    {/* Chọn ảnh */}
                    {/* Chọn ảnh */}
                    <div className="space-y-2 " >
                        <Label>Ảnh Cover</Label>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-3">
                                    {/* Button chọn ảnh */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-32 justify-start colorDashboard"
                                            >
                                                {field.value ? "Update ảnh" : "Chọn ảnh"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="grid grid-cols-3 gap-2 w-80">
                                            {product.product_images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`option-${idx}`}
                                                    className={`w-20 h-20 rounded cursor-pointer border ${field.value === img
                                                        ? "border-blue-500"
                                                        : "border-transparent"
                                                        }`}
                                                    onClick={() => field.onChange(img)}
                                                />
                                            ))}
                                        </PopoverContent>
                                    </Popover>

                                    {/* Ảnh preview ở dưới */}
                                    {field.value && (
                                        <div className="flex justify-center">
                                            <img
                                                src={field.value}
                                                alt="selected"
                                                className="w-32 h-32 rounded-lg object-cover border shadow-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </div>


                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset()
                                setOpen(false)
                            }}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">Lưu</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
