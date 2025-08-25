"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
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
import { Plus } from "lucide-react"

interface Category {
    _id: string
    category_name: string
    category_slug: string
    category_description: string
    status: "active" | "inactive"
    createdAt: string
    updatedAt: string
}

interface AddCategoryDialogProps {
    onAdd: (newCategory: Category) => void,
    open?: boolean
    setOpen?: (open: boolean) => void
}

export default function AddCategoryDialog({ onAdd, open, setOpen }: AddCategoryDialogProps) {
    const [formData, setFormData] = useState({
        category_name: "",
        category_slug: "",
        category_description: "",
        status: "active" as "active" | "inactive",
    })

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = () => {
        const newCategory: Category = {
            _id: crypto.randomUUID(), // tạo id tạm
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        onAdd(newCategory)
        setOpen(false)
        setFormData({
            category_name: "",
            category_slug: "",
            category_description: "",
            status: "active",
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Thêm danh mục mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin danh mục trà mới để lưu vào hệ thống.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên danh mục</Label>
                        <Input
                            id="name"
                            value={formData.category_name}
                            onChange={(e) => handleChange("category_name", e.target.value)}
                            placeholder="Ví dụ: Bạch trà"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.category_description}
                            onChange={(e) =>
                                handleChange("category_description", e.target.value)
                            }
                            placeholder="Mô tả ngắn về loại trà này..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Trạng thái</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                handleChange("status", value as "active" | "inactive")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Không hoạt động</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="rounded-xl"
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} className="rounded-xl">
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
