"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Loader2, Save, X } from "lucide-react"
import { toast } from "react-toastify"
import { updateCompanyInfoAPIs } from "@/apis/company-info.apis"

interface UpdateBasicInfoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    companyInfo: CompanyInfo | null
    onSuccess: (companyInfo: CompanyInfo) => void
}

interface BasicInfoFormData {
    company_name: string
    company_description: string
    company_address: string
    company_phone: string
    company_email: string
}

export default function UpdateBasicInfoDialog({
    open,
    onOpenChange,
    companyInfo,
    onSuccess
}: UpdateBasicInfoDialogProps) {
    const [formData, setFormData] = useState<BasicInfoFormData>({
        company_name: "",
        company_description: "",
        company_address: "",
        company_phone: "",
        company_email: ""
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    // Initialize form data when companyInfo changes
    useEffect(() => {
        if (companyInfo) {
            setFormData({
                company_name: companyInfo.company_name || "",
                company_description: companyInfo.company_description || "",
                company_address: companyInfo.company_address || "",
                company_phone: companyInfo.company_phone || "",
                company_email: companyInfo.company_email || ""
            })
        }
    }, [companyInfo])

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setErrors([])
        }
    }, [open])

    const handleInputChange = (field: keyof BasicInfoFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([])
        }
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = []

        if (!formData.company_name?.trim()) {
            newErrors.push("Tên công ty là bắt buộc")
        }

        if (!formData.company_description?.trim()) {
            newErrors.push("Mô tả công ty là bắt buộc")
        }

        if (!formData.company_address?.trim()) {
            newErrors.push("Địa chỉ công ty là bắt buộc")
        }

        if (!formData.company_phone?.trim()) {
            newErrors.push("Số điện thoại là bắt buộc")
        }

        if (!formData.company_email?.trim()) {
            newErrors.push("Email là bắt buộc")
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
            newErrors.push("Email không hợp lệ")
        }

        setErrors(newErrors)
        return newErrors.length === 0
    }

    const handleSubmit = async () => {
        if (!companyInfo || !validateForm()) return

        setLoading(true)
        try {
            const response = await updateCompanyInfoAPIs(companyInfo._id, formData)
            onSuccess(response.data)
            onOpenChange(false)
            toast.success("Cập nhật thông tin cơ bản thành công!")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Cập Nhật Thông Tin Cơ Bản
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin cơ bản của công ty
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 mb-2">Vui lòng sửa các lỗi sau:</h4>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Thông Tin Công Ty</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="company_name">Tên Công Ty *</Label>
                                <Input
                                    id="company_name"
                                    value={formData.company_name}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    placeholder="Nhập tên công ty..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="company_description">Mô Tả *</Label>
                                <Textarea
                                    id="company_description"
                                    value={formData.company_description}
                                    onChange={(e) => handleInputChange('company_description', e.target.value)}
                                    placeholder="Mô tả về công ty..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="company_address">Địa Chỉ *</Label>
                                <Input
                                    id="company_address"
                                    value={formData.company_address}
                                    onChange={(e) => handleInputChange('company_address', e.target.value)}
                                    placeholder="Nhập địa chỉ công ty..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="company_phone">Số Điện Thoại *</Label>
                                    <Input
                                        id="company_phone"
                                        value={formData.company_phone}
                                        onChange={(e) => handleInputChange('company_phone', e.target.value)}
                                        placeholder="Nhập số điện thoại..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="company_email">Email *</Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={formData.company_email}
                                        onChange={(e) => handleInputChange('company_email', e.target.value)}
                                        placeholder="Nhập email..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
