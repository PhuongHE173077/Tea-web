import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, X, RotateCcw, Image, MoveUp, MoveDown } from "lucide-react"
import { toast } from "react-toastify"

interface CarouselSectionProps {
    data?: LandingPageCarousel
    onUpdate: (data: Partial<LandingPageCarousel>) => Promise<any>
    loading: boolean
}

export function CarouselSection({ data, onUpdate, loading }: CarouselSectionProps) {
    const [formData, setFormData] = useState<Partial<LandingPageCarousel>>({
        title: "",
        detail: "",
        carouselList: [],
        isActive: true
    })

    const [newCarouselItem, setNewCarouselItem] = useState("")

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

    const handleAddCarouselItem = () => {
        if (newCarouselItem.trim()) {
            setFormData(prev => ({
                ...prev,
                carouselList: [...(prev.carouselList || []), newCarouselItem.trim()]
            }))
            setNewCarouselItem("")
        }
    }

    const handleRemoveCarouselItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            carouselList: prev.carouselList?.filter((_, i) => i !== index) || []
        }))
    }

    const handleMoveCarouselItem = (index: number, direction: 'up' | 'down') => {
        const carouselList = formData.carouselList || []

        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === carouselList.length - 1)
        ) {
            return
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1
        const newCarouselList = [...carouselList]
        const temp = newCarouselList[index]
        newCarouselList[index] = newCarouselList[newIndex]
        newCarouselList[newIndex] = temp

        setFormData(prev => ({
            ...prev,
            carouselList: newCarouselList
        }))
    }

    const handleUpdateCarouselItem = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            carouselList: prev.carouselList?.map((item, i) =>
                i === index ? value : item
            ) || []
        }))
    }

    return (
        <Card className="bg-[hsl(45_36%_92%)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Cấu hình Carousel
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="carousel-title">Tiêu đề *</Label>
                            <Input
                                id="carousel-title"
                                value={formData.title || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề carousel"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="carousel-detail">Mô tả chi tiết *</Label>
                            <Textarea
                                id="carousel-detail"
                                value={formData.detail || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
                                placeholder="Nhập mô tả chi tiết cho carousel"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Carousel Items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Danh sách hình ảnh Carousel</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newCarouselItem}
                                    onChange={(e) => setNewCarouselItem(e.target.value)}
                                    placeholder="URL hình ảnh"
                                    className="w-64"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCarouselItem())}
                                />
                                <Button type="button" onClick={handleAddCarouselItem} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {formData.carouselList && formData.carouselList.length > 0 ? (
                            <div className="space-y-3">
                                {formData.carouselList.map((item, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Image Preview */}
                                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item}
                                                    alt={`Carousel item ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.style.display = 'none'
                                                    }}
                                                />
                                            </div>

                                            {/* URL Input */}
                                            <div className="flex-1">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => handleUpdateCarouselItem(index, e.target.value)}
                                                    placeholder="URL hình ảnh"
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMoveCarouselItem(index, 'up')}
                                                    disabled={index === 0}
                                                    title="Di chuyển lên"
                                                >
                                                    <MoveUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMoveCarouselItem(index, 'down')}
                                                    disabled={index === (formData.carouselList?.length || 0) - 1}
                                                    title="Di chuyển xuống"
                                                >
                                                    <MoveDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveCarouselItem(index)}
                                                    className="text-destructive hover:text-destructive"
                                                    title="Xóa"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-xs text-muted-foreground">
                                            Vị trí: {index + 1} / {formData.carouselList?.length || 0}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <RotateCcw className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có hình ảnh nào</h3>
                                <p className="mb-4">Thêm URL hình ảnh để tạo carousel.</p>
                            </div>
                        )}

                        {formData.carouselList && formData.carouselList.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                                <p>💡 <strong>Mẹo:</strong> Sử dụng các nút mũi tên để sắp xếp thứ tự hiển thị của hình ảnh trong carousel.</p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="carousel-isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="carousel-isActive">Hiển thị carousel</Label>
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
