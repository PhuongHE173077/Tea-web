"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    RefreshCw,
    Building2,
    Users,
    Activity,
    TrendingUp,
    Share2,
    Edit
} from "lucide-react"
import { toast } from "react-toastify"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    fetchSingleCompanyInfoAPIs,
    fetchCompanyInfoStatsAPIs
} from "@/apis/company-info.apis"
import AddCompanyInfoDialog from "./components/AddCompanyInfoDialog"
import UpdateBasicInfoDialog from "./components/UpdateBasicInfoDialog"
import UpdateSocialMediaDialog from "./components/UpdateSocialMediaDialog"
import SocialMediaManager from "./components/SocialMediaManager"

export default function CompanyInfoManage() {
    const isMobile = useIsMobile()

    // State for data
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
    const [stats, setStats] = useState<CompanyInfoStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // State for dialogs
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [updateBasicInfoDialogOpen, setUpdateBasicInfoDialogOpen] = useState(false)
    const [updateSocialMediaDialogOpen, setUpdateSocialMediaDialogOpen] = useState(false)

    // Fetch data
    const fetchData = async (showLoading = true) => {
        if (showLoading) setLoading(true)
        try {
            const [companyResponse, statsResponse] = await Promise.all([
                fetchSingleCompanyInfoAPIs(),
                fetchCompanyInfoStatsAPIs()
            ])

            setCompanyInfo(companyResponse.data)
            setStats(statsResponse.data)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu")
        } finally {
            if (showLoading) setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchData()
    }, [])

    // Handlers
    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchData(false)
        setRefreshing(false)
        toast.success("Dữ liệu đã được cập nhật")
    }

    const handleAddSuccess = (newCompanyInfo: CompanyInfo) => {
        setCompanyInfo(newCompanyInfo)
        if (stats) {
            setStats(prev => prev ? { ...prev, total: 1 } : null)
        }
    }

    const handleUpdateSuccess = (updatedCompanyInfo: CompanyInfo) => {
        setCompanyInfo(updatedCompanyInfo)
    }

    const handleEditBasicInfo = () => {
        if (companyInfo) {
            setUpdateBasicInfoDialogOpen(true)
        }
    }

    const handleEditSocialMedia = () => {
        if (companyInfo) {
            setUpdateSocialMediaDialogOpen(true)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Thông Tin Công Ty</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin công ty và các kênh truyền thông xã hội
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        size={isMobile ? "sm" : "default"}
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {!isMobile && "Làm mới"}
                    </Button>

                </div>
            </div>


            {/* Company Info Details */}
            {loading ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                        <p className="text-muted-foreground">Đang tải thông tin công ty...</p>
                    </CardContent>
                </Card>
            ) : companyInfo ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Thông Tin Cơ Bản</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditBasicInfo}
                                >
                                    <Edit className="h-4 w-4" />
                                    {!isMobile && <span className="ml-2">Chỉnh sửa</span>}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tên Công Ty</p>
                                <p className="text-lg font-semibold">{companyInfo.company_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p>{companyInfo.company_email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Điện Thoại</p>
                                <p>{companyInfo.company_phone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Địa Chỉ</p>
                                <p>{companyInfo.company_address}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mô Tả</p>
                                <p className="text-sm text-muted-foreground">{companyInfo.company_description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Media Manager */}
                    <div>
                        <SocialMediaManager
                            companyInfo={companyInfo}
                            onUpdate={handleUpdateSuccess}
                            onEditClick={handleEditSocialMedia}
                        />
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa Có Thông Tin Công Ty</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Bạn chưa có thông tin công ty nào. Hãy tạo thông tin công ty để bắt đầu.
                        </p>
                        <Button onClick={() => setAddDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo Thông Tin Công Ty
                        </Button>
                    </CardContent>
                </Card>
            )}



            {/* Dialogs */}
            <AddCompanyInfoDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSuccess={handleAddSuccess}
            />

            {companyInfo && (
                <>
                    <UpdateBasicInfoDialog
                        open={updateBasicInfoDialogOpen}
                        onOpenChange={setUpdateBasicInfoDialogOpen}
                        companyInfo={companyInfo}
                        onSuccess={handleUpdateSuccess}
                    />
                    <UpdateSocialMediaDialog
                        open={updateSocialMediaDialogOpen}
                        onOpenChange={setUpdateSocialMediaDialogOpen}
                        companyInfo={companyInfo}
                        onSuccess={handleUpdateSuccess}
                    />
                </>
            )}
        </div>
    )
}
