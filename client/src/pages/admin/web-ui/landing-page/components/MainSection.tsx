import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, Settings, Trash2, Image, MoveUp, MoveDown, Upload, Loader2, X } from "lucide-react"
import { toast } from "react-toastify"
import { isValidImageUrl, uploadSingleImage } from "@/apis/index"

interface MainSectionProps {
    data?: LandingPageMainSectionItem[]
    onUpdate: (data: LandingPageMainSectionItem[]) => Promise<any>
    loading: boolean
}

export function MainSection({ data, onUpdate, loading }: MainSectionProps) {
    const [formData, setFormData] = useState<LandingPageMainSectionItem[]>([])
    const [uploadingStates, setUploadingStates] = useState<{ [key: number]: boolean }>({})
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

    useEffect(() => {
        if (data) {
            setFormData(data)
        }
    }, [data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate required fields
        const hasEmptyFields = formData.some(item =>
            !item.title || !item.detail || !item.imageCover
        )

        if (hasEmptyFields) {
            toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các mục")
            return
        }

        try {
            await onUpdate(formData)
        } catch (error) {
            // Error handled in hook
        }
    }

    const handleAddItem = () => {
        const newItem: LandingPageMainSectionItem = {
            title: "",
            detail: "",
            imageCover: "",
            isActive: true
        }

        setFormData(prev => [...prev, newItem])
    }

    const handleUpdateItem = (index: number, field: keyof LandingPageMainSectionItem, value: string | boolean) => {
        setFormData(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ))
    }

    const handleRemoveItem = (index: number) => {
        setFormData(prev => prev.filter((_, i) => i !== index))
    }

    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === formData.length - 1)
        ) {
            return
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1
        const newFormData = [...formData]
        const temp = newFormData[index]
        newFormData[index] = newFormData[newIndex]
        newFormData[newIndex] = temp

        setFormData(newFormData)
    }

    // Handle image upload
    const handleImageUpload = async (index: number, file: File) => {
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP, SVG)")
            return
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Kích thước file không được vượt quá 10MB")
            return
        }

        setUploadingStates(prev => ({ ...prev, [index]: true }))

        try {
            const imageUrl = await uploadSingleImage(file)
            const newFormData = [...formData]
            newFormData[index] = { ...newFormData[index], imageCover: imageUrl }
            setFormData(newFormData)
            toast.success("Upload hình ảnh thành công!")
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("Upload hình ảnh thất bại!")
        } finally {
            setUploadingStates(prev => ({ ...prev, [index]: false }))
        }
    }

    // Handle file input change
    const handleFileInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleImageUpload(index, file)
        }
        // Reset input value to allow selecting the same file again
        event.target.value = ''
    }

    return (
        <Card className="bg-[hsl(45_36%_92%)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Cấu hình Phần Chính
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Danh sách các mục</h3>
                            <p className="text-sm text-muted-foreground">
                                Quản lý các mục hiển thị trong phần chính của trang
                            </p>
                        </div>
                        <Button type="button" onClick={handleAddItem} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm mục mới
                        </Button>
                    </div>

                    {formData.length > 0 ? (
                        <div className="space-y-6">
                            {formData.map((item, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">Mục #{index + 1}</h4>
                                            <Switch
                                                checked={item.isActive}
                                                onCheckedChange={(checked) => handleUpdateItem(index, 'isActive', checked)}
                                            />
                                            <Label className="text-sm">
                                                {item.isActive ? "Hiển thị" : "Ẩn"}
                                            </Label>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMoveItem(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <MoveUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMoveItem(index, 'down')}
                                                disabled={index === formData.length - 1}
                                            >
                                                <MoveDown className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Tiêu đề *</Label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                                                    placeholder="Nhập tiêu đề mục"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Hình ảnh *</Label>

                                                {/* Image Preview */}
                                                <div className="w-full h-40 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                                    {item.imageCover ? (
                                                        <img
                                                            src={item.imageCover}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            <div className="text-center">
                                                                <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                                <p className="text-sm">Chưa có hình ảnh</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Buttons */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fileInputRefs.current[index]?.click()}
                                                        disabled={uploadingStates[index]}
                                                        className="flex-1"
                                                    >
                                                        {uploadingStates[index] ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Đang upload...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                {item.imageCover ? 'Thay đổi hình ảnh' : 'Upload hình ảnh'}
                                                            </>
                                                        )}
                                                    </Button>

                                                    {item.imageCover && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUpdateItem(index, 'imageCover', '')}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Hidden File Input */}
                                                <input
                                                    type="file"
                                                    ref={(el) => fileInputRefs.current[index] = el}
                                                    onChange={(e) => handleFileInputChange(index, e)}
                                                    accept="image/*"
                                                    className="hidden"
                                                />


                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Mô tả chi tiết *</Label>
                                            <Textarea
                                                value={item.detail}
                                                onChange={(e) => handleUpdateItem(index, 'detail', e.target.value)}
                                                placeholder="Nhập mô tả chi tiết cho mục này"
                                                rows={4}
                                                required
                                            />
                                        </div>
                                    </div>


                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Chưa có mục nào</h3>
                            <p className="mb-4">Nhấn "Thêm mục mới" để bắt đầu tạo nội dung cho phần chính.</p>
                            <Button type="button" onClick={handleAddItem} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm mục đầu tiên
                            </Button>
                        </div>
                    )}

                    {formData.length > 0 && (
                        <>
                            <Separator />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={loading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
