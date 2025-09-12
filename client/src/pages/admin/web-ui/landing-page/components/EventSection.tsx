import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, X, Calendar, Trash2, Image } from "lucide-react"
import { toast } from "react-toastify"

interface EventSectionProps {
    data?: LandingPageEventSection
    onUpdate: (data: Partial<LandingPageEventSection>) => Promise<any>
    loading: boolean
}

export function EventSection({ data, onUpdate, loading }: EventSectionProps) {
    const [formData, setFormData] = useState<Partial<LandingPageEventSection>>({
        tag: [],
        title: "",
        detail: "",
        imageCol1: [],
        imageCol2: [],
        subSection: [],
        isActive: true
    })

    const [newTag, setNewTag] = useState("")
    const [newImageCol1, setNewImageCol1] = useState("")
    const [newImageCol2, setNewImageCol2] = useState("")

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

    // Tag management
    const handleAddTag = () => {
        if (newTag.trim()) {
            setFormData(prev => ({
                ...prev,
                tag: [...(prev.tag || []), newTag.trim()]
            }))
            setNewTag("")
        }
    }

    const handleRemoveTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tag: prev.tag?.filter((_, i) => i !== index) || []
        }))
    }

    // Image Column 1 management
    const handleAddImageCol1 = () => {
        if (newImageCol1.trim()) {
            setFormData(prev => ({
                ...prev,
                imageCol1: [...(prev.imageCol1 || []), newImageCol1.trim()]
            }))
            setNewImageCol1("")
        }
    }

    const handleRemoveImageCol1 = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageCol1: prev.imageCol1?.filter((_, i) => i !== index) || []
        }))
    }

    // Image Column 2 management
    const handleAddImageCol2 = () => {
        if (newImageCol2.trim()) {
            setFormData(prev => ({
                ...prev,
                imageCol2: [...(prev.imageCol2 || []), newImageCol2.trim()]
            }))
            setNewImageCol2("")
        }
    }

    const handleRemoveImageCol2 = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageCol2: prev.imageCol2?.filter((_, i) => i !== index) || []
        }))
    }

    // SubSection management
    const handleAddSubSection = () => {
        const newSubSection: LandingPageEventSubSection = {
            title: "",
            detail: ""
        }

        setFormData(prev => ({
            ...prev,
            subSection: [...(prev.subSection || []), newSubSection]
        }))
    }

    const handleUpdateSubSection = (index: number, field: keyof LandingPageEventSubSection, value: string) => {
        setFormData(prev => ({
            ...prev,
            subSection: prev.subSection?.map((sub, i) =>
                i === index ? { ...sub, [field]: value } : sub
            ) || []
        }))
    }

    const handleRemoveSubSection = (index: number) => {
        setFormData(prev => ({
            ...prev,
            subSection: prev.subSection?.filter((_, i) => i !== index) || []
        }))
    }

    return (
        <Card className="bg-[hsl(45_36%_92%)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cấu hình Phần Sự Kiện
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="event-title">Tiêu đề *</Label>
                            <Input
                                id="event-title"
                                value={formData.title || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề phần sự kiện"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="event-detail">Mô tả chi tiết *</Label>
                            <Textarea
                                id="event-detail"
                                value={formData.detail || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                                placeholder="Nhập mô tả chi tiết cho phần sự kiện"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Tags */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Thêm tag mới"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <Button type="button" onClick={handleAddTag} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {formData.tag && formData.tag.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tag.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() => handleRemoveTag(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Image Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Column 1 */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">Hình ảnh cột 1</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newImageCol1}
                                    onChange={(e) => setNewImageCol1(e.target.value)}
                                    placeholder="URL hình ảnh"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageCol1())}
                                />
                                <Button type="button" onClick={handleAddImageCol1} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {formData.imageCol1 && formData.imageCol1.length > 0 && (
                                <div className="space-y-2">
                                    {formData.imageCol1.map((img, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <Image className="h-4 w-4" />
                                            <span className="flex-1 text-sm truncate">{img}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveImageCol1(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Image Column 2 */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">Hình ảnh cột 2</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newImageCol2}
                                    onChange={(e) => setNewImageCol2(e.target.value)}
                                    placeholder="URL hình ảnh"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageCol2())}
                                />
                                <Button type="button" onClick={handleAddImageCol2} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {formData.imageCol2 && formData.imageCol2.length > 0 && (
                                <div className="space-y-2">
                                    {formData.imageCol2.map((img, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <Image className="h-4 w-4" />
                                            <span className="flex-1 text-sm truncate">{img}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveImageCol2(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Sub Sections */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Phần con</Label>
                            <Button type="button" onClick={handleAddSubSection} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm phần con
                            </Button>
                        </div>

                        {formData.subSection && formData.subSection.length > 0 ? (
                            <div className="space-y-4">
                                {formData.subSection.map((sub, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-medium">Phần con #{index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveSubSection(index)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Tiêu đề</Label>
                                                <Input
                                                    value={sub.title || ""}
                                                    onChange={(e) => handleUpdateSubSection(index, 'title', e.target.value)}
                                                    placeholder="Tiêu đề phần con"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Mô tả</Label>
                                                <Input
                                                    value={sub.detail || ""}
                                                    onChange={(e) => handleUpdateSubSection(index, 'detail', e.target.value)}
                                                    placeholder="Mô tả phần con"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Chưa có phần con nào. Nhấn "Thêm phần con" để bắt đầu.</p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="event-isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="event-isActive">Hiển thị phần sự kiện</Label>
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
