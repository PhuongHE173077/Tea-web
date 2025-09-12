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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Loader2, Save, X, ExternalLink, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { updateCompanyInfoAPIs, getSocialMediaConfig, isValidUrl } from "@/apis/company-info.apis"

interface UpdateSocialMediaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    companyInfo: CompanyInfo | null
    onSuccess: (companyInfo: CompanyInfo) => void
}

interface SocialMediaFormData {
    company_facebook: SocialMediaInfo
    company_instagram: SocialMediaInfo
    company_youtube: SocialMediaInfo
    company_tiktok: SocialMediaInfo
    company_twitter: SocialMediaInfo
    company_linkedin: SocialMediaInfo
    company_shopee: SocialMediaInfo
    company_zalo: SocialMediaInfo
}

export default function UpdateSocialMediaDialog({
    open,
    onOpenChange,
    companyInfo,
    onSuccess
}: UpdateSocialMediaDialogProps) {
    const [formData, setFormData] = useState<SocialMediaFormData>({
        company_facebook: { url: "", name: "", isActive: true },
        company_instagram: { url: "", name: "", isActive: true },
        company_youtube: { url: "", name: "", isActive: true },
        company_tiktok: { url: "", name: "", isActive: true },
        company_twitter: { url: "", name: "", isActive: true },
        company_linkedin: { url: "", name: "", isActive: true },
        company_shopee: { url: "", name: "", isActive: true },
        company_zalo: { url: "", name: "", isActive: true }
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    const socialPlatforms = ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'shopee', 'zalo']

    // Initialize form data when companyInfo changes
    useEffect(() => {
        if (companyInfo) {
            setFormData({
                company_facebook: { ...companyInfo.company_facebook },
                company_instagram: { ...companyInfo.company_instagram },
                company_youtube: { ...companyInfo.company_youtube },
                company_tiktok: { ...companyInfo.company_tiktok },
                company_twitter: { ...companyInfo.company_twitter },
                company_linkedin: { ...companyInfo.company_linkedin },
                company_shopee: { ...companyInfo.company_shopee },
                company_zalo: { ...companyInfo.company_zalo }
            })
        }
    }, [companyInfo])

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setErrors([])
        }
    }, [open])

    const handleSocialMediaChange = (platform: string, field: keyof SocialMediaInfo, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [`company_${platform}`]: {
                ...prev[`company_${platform}` as keyof SocialMediaFormData] as SocialMediaInfo,
                [field]: value
            }
        }))
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([])
        }
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = []

        socialPlatforms.forEach(platform => {
            const socialData = formData[`company_${platform}` as keyof SocialMediaFormData] as SocialMediaInfo
            const config = getSocialMediaConfig(platform)

            if (socialData.isActive) {
                if (!socialData.url?.trim()) {
                    newErrors.push(`URL ${config.name} là bắt buộc khi được kích hoạt`)
                } else if (!isValidUrl(socialData.url)) {
                    newErrors.push(`URL ${config.name} không hợp lệ`)
                }

                if (!socialData.name?.trim()) {
                    newErrors.push(`Tên hiển thị ${config.name} là bắt buộc khi được kích hoạt`)
                }
            }
        })

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
            toast.success("Cập nhật thông tin mạng xã hội thành công!")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật mạng xã hội")
        } finally {
            setLoading(false)
        }
    }

    const getActiveSocialCount = () => {
        return socialPlatforms.filter(platform => {
            const socialData = formData[`company_${platform}` as keyof SocialMediaFormData] as SocialMediaInfo
            return socialData?.isActive
        }).length
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Cập Nhật Mạng Xã Hội
                        <Badge variant="outline" className="ml-2">
                            {getActiveSocialCount()}/{socialPlatforms.length} hoạt động
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin các kênh mạng xã hội của công ty
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <h4 className="font-medium text-red-800">Vui lòng sửa các lỗi sau:</h4>
                            </div>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {socialPlatforms.map(platform => {
                            const config = getSocialMediaConfig(platform)
                            const socialData = formData[`company_${platform}` as keyof SocialMediaFormData] as SocialMediaInfo

                            return (
                                <Card key={platform} className={`transition-all ${socialData.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center justify-between text-base">
                                            <div className="flex items-center gap-2">
                                                <img src={config.icon} alt={config.name} className="h-6 w-6" />
                                                <span>{config.name}</span>
                                            </div>
                                            <Switch
                                                checked={socialData.isActive}
                                                onCheckedChange={(checked) => handleSocialMediaChange(platform, 'isActive', checked)}
                                            />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <Label htmlFor={`${platform}_name`}>
                                                Tên hiển thị {socialData.isActive && <span className="text-red-500">*</span>}
                                            </Label>
                                            <Input
                                                id={`${platform}_name`}
                                                value={socialData.name}
                                                onChange={(e) => handleSocialMediaChange(platform, 'name', e.target.value)}
                                                placeholder={`Tên hiển thị cho ${config.name}...`}
                                                disabled={!socialData.isActive}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor={`${platform}_url`}>
                                                URL {socialData.isActive && <span className="text-red-500">*</span>}
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`${platform}_url`}
                                                    value={socialData.url}
                                                    onChange={(e) => handleSocialMediaChange(platform, 'url', e.target.value)}
                                                    placeholder={`https://${platform}.com/...`}
                                                    disabled={!socialData.isActive}
                                                />
                                                {socialData.url && socialData.isActive && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(socialData.url, '_blank')}
                                                        className="px-3"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
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
