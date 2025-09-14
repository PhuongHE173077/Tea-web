import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, X, FileText, Trash2, Image, Upload, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { isValidImageUrl, uploadSingleImage } from "@/apis/index"

interface AboutSectionProps {
    data?: LandingPageAboutSection
    onUpdate: (data: Partial<LandingPageAboutSection>) => Promise<any>
    loading: boolean
}

export function AboutSection({ data, onUpdate, loading }: AboutSectionProps) {
    const [formData, setFormData] = useState<Partial<LandingPageAboutSection>>({
        title: "",
        detail: "",
        attribute: [],
        isActive: true
    })

    const [uploadingStates, setUploadingStates] = useState<{ [key: number]: boolean }>({})
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

    useEffect(() => {
        if (data) {
            setFormData(data)
        }
    }, [data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.detail) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        try {
            await onUpdate(formData)
        } catch (error) {
            // Error handled in hook
        }
    }

    const handleAddAttribute = () => {
        const newAttribute: LandingPageAboutAttribute = {
            icon: "",
            title: "",
            detail: ""
        }

        setFormData(prev => ({
            ...prev,
            attribute: [...(prev.attribute || []), newAttribute]
        }))
    }

    const handleUpdateAttribute = (index: number, field: keyof LandingPageAboutAttribute, value: string) => {
        setFormData(prev => ({
            ...prev,
            attribute: prev.attribute?.map((attr, i) =>
                i === index ? { ...attr, [field]: value } : attr
            ) || []
        }))
    }

    const handleRemoveAttribute = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attribute: prev.attribute?.filter((_, i) => i !== index) || []
        }))
    }

    // Handle icon upload
    const handleIconUpload = async (index: number, file: File) => {
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP, SVG)")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước file không được vượt quá 5MB")
            return
        }

        setUploadingStates(prev => ({ ...prev, [index]: true }))

        try {
            const imageUrl = await uploadSingleImage(file)
            handleUpdateAttribute(index, 'icon', imageUrl)
            toast.success("Upload icon thành công!")
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("Upload icon thất bại!")
        } finally {
            setUploadingStates(prev => ({ ...prev, [index]: false }))
        }
    }

    // Handle file input change
    const handleFileInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleIconUpload(index, file)
        }
        // Reset input value to allow selecting the same file again
        event.target.value = ''
    }

    return (
        <Card className="bg-[hsl(45_36%_92%)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Cấu hình Phần Giới Thiệu
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="about-title">Tiêu đề *</Label>
                            <Input
                                id="about-title"
                                value={formData.title || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề phần giới thiệu"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="about-detail">Mô tả chi tiết *</Label>
                            <Textarea
                                id="about-detail"
                                value={formData.detail || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                                placeholder="Nhập mô tả chi tiết cho phần giới thiệu"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Thuộc tính đặc biệt</Label>
                            <Button type="button" onClick={handleAddAttribute} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm thuộc tính
                            </Button>
                        </div>

                        {formData.attribute && formData.attribute.length > 0 ? (
                            <div className="space-y-4">
                                {formData.attribute.map((attr, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-medium">Thuộc tính #{index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveAttribute(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Icon/Biểu tượng</Label>

                                                <div className="flex items-center gap-2">
                                                    <div className="relative w-full lg:w-16 h-16 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                                        {attr.icon ? (
                                                            <img
                                                                src={attr.icon}
                                                                alt="Icon preview"

                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement
                                                                    target.style.display = 'none'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full cursor-pointer flex items-center justify-center text-muted-foreground" onClick={() => fileInputRefs.current[index]?.click()}>
                                                                {uploadingStates[index] ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Image className="h-6 w-6 opacity-50" />
                                                                )
                                                                }
                                                            </div>
                                                        )}

                                                    </div>
                                                    {attr.icon && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUpdateAttribute(index, 'icon', '')}
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

                                            <div className="space-y-2">
                                                <Label>Tiêu đề</Label>
                                                <Input
                                                    value={attr.title || ""}
                                                    onChange={(e) => handleUpdateAttribute(index, 'title', e.target.value)}
                                                    placeholder="Tiêu đề thuộc tính"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Mô tả</Label>
                                                <Input
                                                    value={attr.detail || ""}
                                                    onChange={(e) => handleUpdateAttribute(index, 'detail', e.target.value)}
                                                    placeholder="Mô tả thuộc tính"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Chưa có thuộc tính nào. Nhấn "Thêm thuộc tính" để bắt đầu.</p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="about-isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="about-isActive">Hiển thị phần giới thiệu</Label>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
