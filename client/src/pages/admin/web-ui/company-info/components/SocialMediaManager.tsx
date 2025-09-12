"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ExternalLink, Loader2, AlertCircle, CheckCircle2, XCircle, BarChart3, TrendingUp, TrendingDown, Activity, Edit } from "lucide-react"
import { toast } from "react-toastify"
import { updateSocialMediaStatusAPIs, getSocialMediaConfig } from "@/apis/company-info.apis"

interface SocialMediaManagerProps {
    companyInfo: CompanyInfo
    onUpdate: (updatedCompanyInfo: CompanyInfo) => void
    compact?: boolean
    onEditClick?: () => void
}

export default function SocialMediaManager({
    companyInfo,
    onUpdate,
    compact = false,
    onEditClick
}: SocialMediaManagerProps) {
    const [loadingPlatforms, setLoadingPlatforms] = useState<Set<string>>(new Set())

    const socialPlatforms = ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'shopee', 'zalo']

    // Kiểm tra xem companyInfo có hợp lệ không
    const isCompanyInfoValid = companyInfo && companyInfo._id

    // Helper function để lấy dữ liệu social media an toàn
    const getSocialData = (platform: string): SocialMediaInfo | null => {
        const socialData = companyInfo[`company_${platform}` as keyof CompanyInfo] as SocialMediaInfo
        return socialData || null
    }

    // Helper function để kiểm tra dữ liệu có hợp lệ không
    const isValidSocialData = (socialData: SocialMediaInfo | null): socialData is SocialMediaInfo => {
        return socialData !== null && typeof socialData === 'object' && typeof socialData.isActive === 'boolean'
    }

    const handleToggleStatus = async (platform: string, currentStatus: boolean) => {
        const newStatus = !currentStatus
        setLoadingPlatforms(prev => new Set(prev).add(platform))

        try {
            const response = await updateSocialMediaStatusAPIs(companyInfo._id, {
                platform: platform as SocialMediaStatusUpdate['platform'],
                isActive: newStatus
            })

            onUpdate(response.data)

            toast.success(`${getSocialMediaConfig(platform).name} đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'}`)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || `Có lỗi xảy ra khi cập nhật ${getSocialMediaConfig(platform).name}`)
        } finally {
            setLoadingPlatforms(prev => {
                const newSet = new Set(prev)
                newSet.delete(platform)
                return newSet
            })
        }
    }

    const getActiveSocialCount = () => {
        return socialPlatforms.filter(platform => {
            const socialData = getSocialData(platform)
            return isValidSocialData(socialData) && socialData.isActive
        }).length
    }

    // Loading state khi dữ liệu chưa sẵn sàng
    if (!isCompanyInfoValid) {
        if (compact) {
            return (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Đang tải...</span>
                </div>
            )
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quản Lý Mạng Xã Hội</CardTitle>
                    <CardDescription>Đang tải dữ liệu...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Đang tải thông tin mạng xã hội...</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (compact) {
        return (
            <div className="flex flex-wrap gap-2">
                {socialPlatforms.map(platform => {
                    const config = getSocialMediaConfig(platform)
                    const socialData = getSocialData(platform)
                    const isLoading = loadingPlatforms.has(platform)
                    const isValid = isValidSocialData(socialData)

                    if (!isValid) {
                        return (
                            <TooltipProvider key={platform}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 opacity-50"
                                            disabled
                                        >
                                            <span className="mr-1">{config.icon}</span>
                                            <AlertCircle className="h-3 w-3" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-center">
                                            <p className="font-medium">{config.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Dữ liệu không hợp lệ
                                            </p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    }

                    return (
                        <TooltipProvider key={platform}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={socialData.isActive ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() => handleToggleStatus(platform, socialData.isActive)}
                                        disabled={isLoading}
                                    >
                                        <span className="mr-1">{config.icon}</span>
                                        {isLoading ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : socialData.isActive ? (
                                            <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-center">
                                        <p className="font-medium">{config.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {socialData.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                                        </p>
                                        {socialData.isActive && socialData.name && (
                                            <p className="text-xs">{socialData.name}</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                })}
                <Badge variant="secondary" className="ml-2">
                    {getActiveSocialCount()}/{socialPlatforms.length} hoạt động
                </Badge>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>Quản Lý Mạng Xã Hội</span>
                        <Badge variant="outline">
                            {getActiveSocialCount()}/{socialPlatforms.length} hoạt động
                        </Badge>
                    </div>
                    {onEditClick && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onEditClick}
                        >
                            <Edit className="h-4 w-4" />
                            <span className="ml-2 hidden sm:inline">Chỉnh sửa</span>
                        </Button>
                    )}
                </CardTitle>
                <CardDescription>
                    Bật/tắt các kênh truyền thông xã hội của công ty
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socialPlatforms.map(platform => {
                        const config = getSocialMediaConfig(platform)
                        const socialData = getSocialData(platform)
                        const isLoading = loadingPlatforms.has(platform)
                        const isValid = isValidSocialData(socialData)

                        if (!isValid) {
                            return (
                                <div
                                    key={platform}
                                    className="border rounded-lg p-4 transition-all border-red-200 bg-red-50"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{config.icon}</span>
                                            <div>
                                                <h4 className="font-medium text-sm">{config.name}</h4>
                                                <Badge variant="destructive" className="text-xs">
                                                    Dữ liệu không hợp lệ
                                                </Badge>
                                            </div>
                                        </div>
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="text-xs text-red-600">
                                        Dữ liệu mạng xã hội không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra lại cấu hình.
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div
                                key={platform}
                                className={`border rounded-lg p-4 transition-all ${socialData.isActive
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3 gap-8">
                                    <div className="flex items-center gap-2">
                                        <img src={config.icon} alt={config.name} className="h-6 w-6" />
                                        <div>
                                            <h4 className="font-medium text-sm">{config.name}</h4>
                                            <Badge
                                                variant={socialData.isActive ? "default" : "secondary"}
                                                className="text-xs"
                                            >
                                                {socialData.isActive ? 'Bật' : 'Tắt'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                                        <Switch
                                            className=""
                                            checked={socialData.isActive}
                                            onCheckedChange={() => handleToggleStatus(platform, socialData.isActive)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {socialData.isActive && (
                                    <div className="space-y-2">
                                        {socialData.name && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tên hiển thị:</p>
                                                <p className="text-sm font-medium truncate">{socialData.name}</p>
                                            </div>
                                        )}
                                        {socialData.url && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">URL:</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm truncate flex-1">{socialData.url}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => window.open(socialData.url, '_blank')}
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
