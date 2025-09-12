import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, X, Image } from "lucide-react"
import { toast } from "react-toastify"

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

                        <div className="space-y-2">
                            <Label htmlFor="imageCover">URL Hình ảnh *</Label>
                            <Input
                                id="imageCover"
                                value={formData.imageCover || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageCover: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="detail">Mô tả chi tiết *</Label>
                        <Textarea
                            id="detail"
                            value={formData.detail || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                            placeholder="Nhập mô tả chi tiết cho header"
                            rows={4}
                            required
                        />
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
        </Card>
    )
}
