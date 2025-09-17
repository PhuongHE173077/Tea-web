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

interface UpdateTeaCategoryDialogProps {
    teaCategory: TeaCategory
    onUpdate: (updated: TeaCategory) => void
    open?: boolean
    setOpen?: (open: boolean) => void
}

export default function UpdateTeaCategoryDialog({
    teaCategory,
    onUpdate,
    open,
    setOpen,
}: UpdateTeaCategoryDialogProps) {
    const [formData, setFormData] = useState<TeaCategory>({
        ...teaCategory,
    })

    const handleChange = (field: keyof TeaCategory, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = () => {
        onUpdate({
            ...formData,
            tea_category_slug: formData.tea_category_name.toLowerCase().replace(/\s+/g, '-'),
            updatedAt: new Date().toISOString(),
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Cập nhật loại trà</DialogTitle>
                    <DialogDescription>
                        Thay đổi thông tin loại trà và lưu lại.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên loại trà</Label>
                        <Input
                            id="name"
                            value={formData.tea_category_name}
                            onChange={(e) => handleChange("tea_category_name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.tea_category_description}
                            rows={4}
                            onChange={(e) =>
                                handleChange("tea_category_description", e.target.value)
                            }
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
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} className="rounded-xl">
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

