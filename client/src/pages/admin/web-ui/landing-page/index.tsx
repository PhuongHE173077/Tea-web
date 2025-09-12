"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertTriangle,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    Settings,
    Image,
    Video,
    FileText,
    Calendar,
    RotateCcw
} from "lucide-react"
import { useLandingPage } from "@/hooks/useLandingPage"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HeaderSection } from "./components/HeaderSection"
import { AboutSection } from "./components/AboutSection"
import { VideoSection } from "./components/VideoSection"
import { MainSection } from "./components/MainSection"
import { EventSection } from "./components/EventSection"
import { CarouselSection } from "./components/CarouselSection"

export default function LandingPageManagement() {
    const {
        landingPage,
        loading,
        error,
        fetchLandingPage,
        updateHeader,
        updateAboutSection,
        updateVideo,
        updateMainSection,
        updateEventSection,
        updateCarousel
    } = useLandingPage()

    const [activeTab, setActiveTab] = useState("header")

    const handleRefresh = () => {
        fetchLandingPage()
    }

    if (loading && !landingPage) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    if (error && !landingPage) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
                <Button onClick={handleRefresh} className="mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Thử lại
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            {/* <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Landing Page</h1>
                    <p className="text-muted-foreground">
                        Chỉnh sửa nội dung và cấu hình các phần của trang chủ
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>
                </div>
            </div> */}

            {/* Status Overview */}
            {/* {landingPage && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Image className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Header</span>
                                <Badge variant={landingPage.header.isActive ? "default" : "secondary"}>
                                    {landingPage.header.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Giới thiệu</span>
                                <Badge variant={landingPage.aboutSection.isActive ? "default" : "secondary"}>
                                    {landingPage.aboutSection.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">Video</span>
                                <Badge variant={landingPage.video.isActive ? "default" : "secondary"}>
                                    {landingPage.video.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium">Phần chính</span>
                                <Badge variant="outline">
                                    {landingPage.mainSection.length}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-medium">Sự kiện</span>
                                <Badge variant={landingPage.eventSection.isActive ? "default" : "secondary"}>
                                    {landingPage.eventSection.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4 text-pink-500" />
                                <span className="text-sm font-medium">Carousel</span>
                                <Badge variant={landingPage.carousel.isActive ? "default" : "secondary"}>
                                    {landingPage.carousel.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )} */}

            {/* Main Content */}
            <Card >
                <CardHeader>
                    <CardTitle>Chỉnh sửa nội dung</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="header" className="flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                Header
                            </TabsTrigger>
                            <TabsTrigger value="about" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Giới thiệu
                            </TabsTrigger>
                            <TabsTrigger value="video" className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Video
                            </TabsTrigger>
                            <TabsTrigger value="main" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Phần chính
                            </TabsTrigger>
                            <TabsTrigger value="event" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Sự kiện
                            </TabsTrigger>
                            <TabsTrigger value="carousel" className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Carousel
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="header" className="mt-6 ">
                            <HeaderSection
                                data={landingPage?.header}
                                onUpdate={updateHeader}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="about" className="mt-6">
                            <AboutSection
                                data={landingPage?.aboutSection}
                                onUpdate={updateAboutSection}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="video" className="mt-6">
                            <VideoSection
                                data={landingPage?.video}
                                onUpdate={updateVideo}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="main" className="mt-6">
                            <MainSection
                                data={landingPage?.mainSection}
                                onUpdate={updateMainSection}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="event" className="mt-6">
                            <EventSection
                                data={landingPage?.eventSection}
                                onUpdate={updateEventSection}
                                loading={loading}
                            />
                        </TabsContent>

                        <TabsContent value="carousel" className="mt-6">
                            <CarouselSection
                                data={landingPage?.carousel}
                                onUpdate={updateCarousel}
                                loading={loading}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}