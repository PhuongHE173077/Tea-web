import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, X, Image, Upload, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { uploadSingleImage, isValidImageUrl } from "@/apis/index"

interface HeaderSectionProps {
    data?: LandingPageHeader
    onUpdate: (data: Partial<LandingPageHeader>) => Promise<any>
    loading: boolean
}

export function HeaderSection({ data, onUpdate, loading }: HeaderSectionProps) {
    const [formData, setFormData] = useState<Partial<LandingPageHeader>>({
        title: "",
        detail: "",
        imageCover: "",
        attribute: [],
        isActive: true
    })

    const [newAttribute, setNewAttribute] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (data) {
            setFormData(data)
        }
    }, [data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.detail || !formData.imageCover) {
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
        if (newAttribute.trim()) {
            setFormData(prev => ({
                ...prev,
                attribute: [...(prev.attribute || []), newAttribute.trim()]
            }))
            setNewAttribute("")
        }
    }

    const handleRemoveAttribute = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attribute: prev.attribute?.filter((_, i) => i !== index) || []
        }))
    }

    // Handle image upload
    const handleImageUpload = async (file: File) => {
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP, SVG)")
            return
        }

        // Validate file size (max 10MB for header images)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Kích thước file không được vượt quá 10MB")
            return
        }

        setIsUploading(true)

        try {
            const imageUrl = await uploadSingleImage(file)
            setFormData(prev => ({ ...prev, imageCover: imageUrl }))
            toast.success("Upload hình ảnh thành công!")
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("Upload hình ảnh thất bại!")
        } finally {
            setIsUploading(false)
        }
    }

    // Handle file input change
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleImageUpload(file)
        }
        // Reset input value to allow selecting the same file again
        event.target.value = ''
    }

    return (
        <Card className="bg-[hsl(45_36%_92%)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Cấu hình Header
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề *</Label>
                                <Input
                                    id="title"
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Nhập tiêu đề header"
                                    required
                                />
                            </div>
                            <div className="space-y-2 mt-2">
                                <Label htmlFor="detail">Mô tả chi tiết *</Label>
                                <Textarea
                                    id="detail"
                                    value={formData.detail || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                                    placeholder="Nhập mô tả chi tiết cho header"
                                    rows={7}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Hình ảnh Header *</Label>

                            {/* Image Preview */}
                            <div className="w-full h-48 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                {formData.imageCover ? (
                                    <img
                                        src={formData.imageCover}
                                        alt="Header preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
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
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex-1"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Đang upload...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            {formData.imageCover ? 'Thay đổi hình ảnh' : 'Upload hình ảnh'}
                                        </>
                                    )}
                                </Button>

                                {formData.imageCover && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setFormData(prev => ({ ...prev, imageCover: '' }))}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                accept="image/*"
                                className="hidden"
                            />


                        </div>
                    </div>



                    <div className="space-y-4">
                        <Label>Thuộc tính bổ sung</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newAttribute}
                                onChange={(e) => setNewAttribute(e.target.value)}
                                placeholder="Thêm thuộc tính mới"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttribute())}
                            />
                            <Button type="button" onClick={handleAddAttribute} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {formData.attribute && formData.attribute.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.attribute.map((attr, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {attr}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() => handleRemoveAttribute(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">Hiển thị header</Label>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card >
    )
}
