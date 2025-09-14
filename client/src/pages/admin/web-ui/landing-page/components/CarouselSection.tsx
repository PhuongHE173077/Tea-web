import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Plus, X, RotateCcw, Image, MoveUp, MoveDown, Edit } from "lucide-react"
import { toast } from "react-toastify"
import { AddCarouselItemDialog } from "./AddCarouselItemDialog"

interface CarouselItem {
    title: string
    detail: string
    imageCover: string
    tab: string
}

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

    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [showAddDialog, setShowAddDialog] = useState(false)

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

    const handleAddCarouselItem = (item: CarouselItem) => {
        setFormData(prev => ({
            ...prev,
            carouselList: [...(prev.carouselList || []), item]
        }))
    }

    const handleRemoveCarouselItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            carouselList: prev.carouselList?.filter((_, i) => i !== index) || []
        }))
        if (editingIndex === index) {
            setEditingIndex(null)
        }
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

    const handleUpdateCarouselItem = (index: number, field: keyof CarouselItem, value: string) => {
        setFormData(prev => ({
            ...prev,
            carouselList: prev.carouselList?.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ) || []
        }))
    }

    const handleStartEdit = (index: number) => {
        setEditingIndex(index)
    }

    const handleCancelEdit = () => {
        setEditingIndex(null)
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

                    {/* Add New Carousel Item Button */}
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Danh sách Carousel ({formData.carouselList?.length || 0} mục)</Label>
                        <Button type="button" onClick={() => setShowAddDialog(true)} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm mục mới
                        </Button>
                    </div>

                    {/* Carousel Items List */}
                    <div className="space-y-4">

                        {formData.carouselList && formData.carouselList.length > 0 ? (
                            <div className="space-y-4">
                                {formData.carouselList.map((item, index) => (
                                    <Card key={index} className="p-4">
                                        {editingIndex === index ? (
                                            // Edit Mode
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Tiêu đề *</Label>
                                                        <Input
                                                            value={item.title}
                                                            onChange={(e) => handleUpdateCarouselItem(index, 'title', e.target.value)}
                                                            placeholder="Nhập tiêu đề"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tab/Danh mục</Label>
                                                        <Input
                                                            value={item.tab}
                                                            onChange={(e) => handleUpdateCarouselItem(index, 'tab', e.target.value)}
                                                            placeholder="Nhập danh mục"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label>URL hình ảnh *</Label>
                                                        <Input
                                                            value={item.imageCover}
                                                            onChange={(e) => handleUpdateCarouselItem(index, 'imageCover', e.target.value)}
                                                            placeholder="Nhập URL hình ảnh"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label>Mô tả chi tiết</Label>
                                                        <Textarea
                                                            value={item.detail}
                                                            onChange={(e) => handleUpdateCarouselItem(index, 'detail', e.target.value)}
                                                            placeholder="Nhập mô tả chi tiết"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                                        Hủy
                                                    </Button>
                                                    <Button type="button" onClick={handleCancelEdit}>
                                                        Lưu
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Image Preview */}
                                                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.imageCover}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.style.display = 'none'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold text-lg">{item.title}</h4>
                                                            {item.tab && (
                                                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                                    {item.tab}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.detail && (
                                                            <p className="text-muted-foreground text-sm">{item.detail}</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground break-all">
                                                            URL: {item.imageCover}
                                                        </p>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStartEdit(index)}
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
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

                                                <div className="text-xs text-muted-foreground">
                                                    Vị trí: {index + 1} / {formData.carouselList?.length || 0}
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có mục carousel nào</h3>
                                <p className="mb-4">Thêm mục carousel để hiển thị trên trang chủ.</p>
                            </div>
                        )}

                        {formData.carouselList && formData.carouselList.length > 0 && (
                            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                                <p>💡 <strong>Mẹo:</strong> Sử dụng các nút mũi tên để sắp xếp thứ tự hiển thị của các mục trong carousel. Nhấn nút chỉnh sửa để cập nhật thông tin chi tiết.</p>
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
                        <Label htmlFor="carousel-isActive">Hiển thị carousel trên trang chủ</Label>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </CardContent>

            {/* Add Carousel Item Dialog */}
            <AddCarouselItemDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onAdd={handleAddCarouselItem}
            />
        </Card>
    )
}
