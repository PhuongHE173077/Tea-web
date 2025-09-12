"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify"
import { createCompanyInfoAPIs, validateCompanyInfoData, isValidUrl, getSocialMediaConfig } from "@/apis/company-info.apis"

interface AddCompanyInfoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (companyInfo: CompanyInfo) => void
}

const defaultSocialMedia: SocialMediaInfo = {
    url: "",
    name: "",
    isActive: true
}

const defaultFormData: CompanyInfoFormData = {
    company_name: "",
    company_description: "",
    company_address: "",
    company_phone: "",
    company_email: "",
    company_facebook: { ...defaultSocialMedia },
    company_instagram: { ...defaultSocialMedia },
    company_youtube: { ...defaultSocialMedia },
    company_tiktok: { ...defaultSocialMedia },
    company_twitter: { ...defaultSocialMedia },
    company_linkedin: { ...defaultSocialMedia },
    company_shopee: { ...defaultSocialMedia },
    company_zalo: { ...defaultSocialMedia }
}

export default function AddCompanyInfoDialog({ open, onOpenChange, onSuccess }: AddCompanyInfoDialogProps) {
    const [formData, setFormData] = useState<CompanyInfoFormData>(defaultFormData)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    const socialPlatforms = ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'shopee', 'zalo']

    const handleInputChange = (field: keyof CompanyInfoFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([])
        }
    }

    const handleSocialMediaChange = (platform: string, field: keyof SocialMediaInfo, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [`company_${platform}`]: {
                ...prev[`company_${platform}` as keyof CompanyInfoFormData] as SocialMediaInfo,
                [field]: value
            }
        }))
    }

    const validateForm = (): boolean => {
        const basicErrors = validateCompanyInfoData(formData)
        const socialErrors: string[] = []

        // Validate social media URLs and names
        socialPlatforms.forEach(platform => {
            const socialData = formData[`company_${platform}` as keyof CompanyInfoFormData] as SocialMediaInfo
            if (socialData.isActive) {
                if (!socialData.url || !isValidUrl(socialData.url)) {
                    socialErrors.push(`URL ${getSocialMediaConfig(platform).name} không hợp lệ`)
                }
                if (!socialData.name || socialData.name.trim().length === 0) {
                    socialErrors.push(`Tên ${getSocialMediaConfig(platform).name} không được để trống`)
                }
            }
        })

        const allErrors = [...basicErrors, ...socialErrors]
        setErrors(allErrors)
        return allErrors.length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin")
            return
        }

        setLoading(true)
        try {
            const response = await createCompanyInfoAPIs(formData)
            toast.success("Tạo thông tin công ty thành công!")
            onSuccess(response.data)
            onOpenChange(false)
            setFormData(defaultFormData)
            setErrors([])
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo thông tin công ty")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setFormData(defaultFormData)
        setErrors([])
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm Thông Tin Công Ty</DialogTitle>
                    <DialogDescription>
                        Điền thông tin chi tiết về công ty và các kênh truyền thông xã hội
                    </DialogDescription>
                </DialogHeader>

                {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <h4 className="text-red-800 font-medium mb-2">Có lỗi trong form:</h4>
                        <ul className="text-red-700 text-sm space-y-1">
                            {errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Cơ Bản</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="company_name">Tên Công Ty *</Label>
                                    <Input
                                        id="company_name"
                                        value={formData.company_name}
                                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                                        placeholder="Nhập tên công ty"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="company_email">Email *</Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={formData.company_email}
                                        onChange={(e) => handleInputChange('company_email', e.target.value)}
                                        placeholder="company@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="company_phone">Số Điện Thoại *</Label>
                                    <Input
                                        id="company_phone"
                                        value={formData.company_phone}
                                        onChange={(e) => handleInputChange('company_phone', e.target.value)}
                                        placeholder="0123456789"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="company_address">Địa Chỉ *</Label>
                                    <Input
                                        id="company_address"
                                        value={formData.company_address}
                                        onChange={(e) => handleInputChange('company_address', e.target.value)}
                                        placeholder="Nhập địa chỉ công ty"
                                    />
                                </div>
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
                        </CardContent>
                    </Card>

                    {/* Social Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Mạng Xã Hội</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {socialPlatforms.map(platform => {
                                const config = getSocialMediaConfig(platform)
                                const socialData = formData[`company_${platform}` as keyof CompanyInfoFormData] as SocialMediaInfo

                                return (
                                    <div key={platform} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{config.icon}</span>
                                                <h4 className="font-medium">{config.name}</h4>
                                            </div>
                                            <Switch
                                                checked={socialData.isActive}
                                                onCheckedChange={(checked) =>
                                                    handleSocialMediaChange(platform, 'isActive', checked)
                                                }
                                            />
                                        </div>

                                        {socialData.isActive && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <Label>URL</Label>
                                                    <Input
                                                        value={socialData.url}
                                                        onChange={(e) =>
                                                            handleSocialMediaChange(platform, 'url', e.target.value)
                                                        }
                                                        placeholder={`https://${platform}.com/yourpage`}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Tên Hiển Thị</Label>
                                                    <Input
                                                        value={socialData.name}
                                                        onChange={(e) =>
                                                            handleSocialMediaChange(platform, 'name', e.target.value)
                                                        }
                                                        placeholder={`Tên ${config.name}`}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo Công Ty"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
