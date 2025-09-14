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
import ImageUpload from "@/components/ui/image-upload"


interface UpdateCategoryDialogProps {
    category: Category
    onUpdate: (updated: Category) => void
    open?: boolean
    setOpen?: (open: boolean) => void
}

export default function UpdateCategoryDialog({
    category,
    onUpdate,
    open,
    setOpen,
}: UpdateCategoryDialogProps) {
    const [formData, setFormData] = useState<Category>({
        ...category,
        category_icon: category.category_icon || "",
        category_image: category.category_image || { url: "", isActive: true }
    })

    const handleChange = (field: keyof Category, value: string | { url: string; isActive: boolean }) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleImageUrlChange = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            category_image: {
                ...prev.category_image,
                url: url
            }
        }))
    }

    const handleImageActiveChange = (isActive: boolean) => {
        setFormData((prev) => ({
            ...prev,
            category_image: {
                ...prev.category_image,
                isActive: isActive
            }
        }))
    }



    const handleSubmit = () => {
        onUpdate({
            ...formData,
            updatedAt: new Date().toISOString(),
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-lg rounded-2xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật danh mục</DialogTitle>
                    <DialogDescription>
                        Thay đổi thông tin danh mục và lưu lại.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên danh mục</Label>
                        <Input
                            id="name"
                            value={formData.category_name}
                            onChange={(e) => handleChange("category_name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.category_description}
                            rows={6}
                            onChange={(e) =>
                                handleChange("category_description", e.target.value)
                            }
                        />
                    </div>

                    <ImageUpload
                        label="Icon"
                        value={formData.category_icon || ""}
                        onChange={(url) => handleChange("category_icon", url)}
                        placeholder="URL icon hoặc upload file"
                        previewSize="sm"
                    />

                    <div className="space-y-2">
                        <ImageUpload
                            label="Hình ảnh"
                            value={formData.category_image?.url || ""}
                            onChange={handleImageUrlChange}
                            placeholder="URL hình ảnh hoặc upload file"
                            previewSize="md"
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="image-active"
                                checked={formData.category_image?.isActive ?? true}
                                onChange={(e) => handleImageActiveChange(e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="image-active" className="text-sm">Kích hoạt hình ảnh</Label>
                        </div>
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
