"use client"

import { useState } from "react"
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

interface AddTeaCategoryDialogProps {
    onAdd: (newTeaCategory: TeaCategory) => void,
    open?: boolean
    setOpen?: (open: boolean) => void
}

export default function AddTeaCategoryDialog({ onAdd, open, setOpen }: AddTeaCategoryDialogProps) {
    const [formData, setFormData] = useState({
        tea_category_name: "",
        tea_category_description: "",
        status: "active" as "active" | "inactive",
    })

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = () => {
        const newTeaCategory: TeaCategory = {
            _id: crypto.randomUUID(), // tạo id tạm
            ...formData,
            tea_category_slug: formData.tea_category_name.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        onAdd(newTeaCategory)
        setOpen(false)
        setFormData({
            tea_category_name: "",
            tea_category_description: "",
            status: "active",
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Thêm loại trà mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin loại trà mới để lưu vào hệ thống.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên loại trà</Label>
                        <Input
                            id="name"
                            value={formData.tea_category_name}
                            onChange={(e) => handleChange("tea_category_name", e.target.value)}
                            placeholder="Ví dụ: Bạch trà, Lục trà, Hồng trà..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.tea_category_description}
                            onChange={(e) =>
                                handleChange("tea_category_description", e.target.value)
                            }
                            placeholder="Mô tả chi tiết về loại trà này..."
                            rows={4}
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

