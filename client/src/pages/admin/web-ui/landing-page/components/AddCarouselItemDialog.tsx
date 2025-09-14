import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react"
import { toast } from "react-toastify"
import { uploadSingleImage } from "@/apis"

interface CarouselItem {
    title: string
    detail: string
    imageCover: string
    tab: string
}

interface AddCarouselItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (item: CarouselItem) => void
}

export function AddCarouselItemDialog({ open, onOpenChange, onAdd }: AddCarouselItemDialogProps) {
    const [formData, setFormData] = useState<CarouselItem>({
        title: "",
        detail: "",
        imageCover: "",
        tab: ""
    })
    const [isUploading, setIsUploading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string>("")

    const handleReset = () => {
        setFormData({
            title: "",
            detail: "",
            imageCover: "",
            tab: ""
        })
        setPreviewImage("")
    }

    const handleClose = () => {
        handleReset()
        onOpenChange(false)
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn file hình ảnh")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước file không được vượt quá 5MB")
            return
        }

        setIsUploading(true)
        try {
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            // Upload file
            const imageUrl = await uploadSingleImage(file)
            setFormData(prev => ({ ...prev, imageCover: imageUrl }))
            toast.success("Upload hình ảnh thành công!")
        } catch (error) {
            toast.error("Upload hình ảnh thất bại!")
            console.error(error)
            setPreviewImage("")
        } finally {
            setIsUploading(false)
            // Reset input
            event.target.value = ""
        }
    }

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, imageCover: "" }))
        setPreviewImage("")
    }

    const handleSubmit = () => {
        // Validation
        if (!formData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề")
            return
        }

        if (!formData.imageCover.trim()) {
            toast.error("Vui lòng chọn hình ảnh")
            return
        }

        // Add item
        onAdd({
            ...formData,
            title: formData.title.trim(),
            detail: formData.detail.trim(),
            tab: formData.tab.trim()
        })

        // Reset and close
        handleReset()
        onOpenChange(false)
        toast.success("Thêm mục carousel thành công!")
    }

    const displayImage = previewImage || formData.imageCover

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm mục Carousel mới</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-3">
                        <Label>Hình ảnh *</Label>
                        
                        {displayImage ? (
                            <div className="relative">
                                <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                                    <img
                                        src={displayImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => {
                                            setPreviewImage("")
                                            setFormData(prev => ({ ...prev, imageCover: "" }))
                                        }}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={isUploading}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={isUploading}
                                            className="pointer-events-none"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Đang upload...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Chọn hình ảnh
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Hoặc kéo thả file vào đây
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* URL Input as alternative */}
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Hoặc nhập URL hình ảnh</Label>
                            <Input
                                value={formData.imageCover}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, imageCover: e.target.value }))
                                    setPreviewImage("")
                                }}
                                placeholder="https://example.com/image.jpg"
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tab">Tab/Danh mục</Label>
                            <Input
                                id="tab"
                                value={formData.tab}
                                onChange={(e) => setFormData(prev => ({ ...prev, tab: e.target.value }))}
                                placeholder="Nhập danh mục"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="detail">Mô tả chi tiết</Label>
                        <Textarea
                            id="detail"
                            value={formData.detail}
                            onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                            placeholder="Nhập mô tả chi tiết"
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isUploading}>
                        Thêm mục
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
