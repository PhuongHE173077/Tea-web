import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Video, Play, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"

interface VideoSectionProps {
    data?: LandingPageVideo
    onUpdate: (data: Partial<LandingPageVideo>) => Promise<any>
    loading: boolean
}

export function VideoSection({ data, onUpdate, loading }: VideoSectionProps) {
    const [formData, setFormData] = useState<Partial<LandingPageVideo>>({
        url: "",
        isActive: true
    })

    const [videoPreview, setVideoPreview] = useState<string>("")

    useEffect(() => {
        if (data) {
            setFormData(data)
            setVideoPreview(data.url || "")
        }
    }, [data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.url) {
            toast.error("Vui lòng nhập URL video")
            return
        }

        // Validate video URL
        if (!isValidVideoUrl(formData.url)) {
            toast.error("URL video không hợp lệ. Vui lòng sử dụng URL từ YouTube, Vimeo hoặc file video trực tiếp.")
            return
        }

        try {
            await onUpdate(formData)
        } catch (error) {
            // Error handled in hook
        }
    }

    const isValidVideoUrl = (url: string): boolean => {
        const videoUrlPatterns = [
            /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
            /^https?:\/\/(www\.)?vimeo\.com\/.+/,
            /^https?:\/\/.+\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i
        ]

        return videoUrlPatterns.some(pattern => pattern.test(url))
    }

    const getVideoEmbedUrl = (url: string): string => {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`
        }

        // Direct video file
        return url
    }

    const handleUrlChange = (url: string) => {
        setFormData(prev => ({ ...prev, url }))
        setVideoPreview(url)
    }

    return (
        <Card className="bg-[hsl(45_36%_92%)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Cấu hình Video
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="video-url">URL Video *</Label>
                        <Input
                            id="video-url"
                            value={formData.url || ""}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=... hoặc https://vimeo.com/..."
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            Hỗ trợ YouTube, Vimeo hoặc file video trực tiếp (.mp4, .webm, .ogg)
                        </p>
                    </div>

                    {/* Video Preview */}
                    {videoPreview && isValidVideoUrl(videoPreview) && (
                        <div className="space-y-2">
                            <Label>Xem trước video</Label>
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                {videoPreview.includes('youtube.com') || videoPreview.includes('youtu.be') || videoPreview.includes('vimeo.com') ? (
                                    <iframe
                                        src={getVideoEmbedUrl(videoPreview)}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={videoPreview}
                                        className="w-full h-full object-cover"
                                        controls
                                        preload="metadata"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Invalid URL Warning */}
                    {videoPreview && !isValidVideoUrl(videoPreview) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                URL video không hợp lệ. Vui lòng sử dụng URL từ YouTube, Vimeo hoặc file video trực tiếp.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Video URL Examples */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Ví dụ URL hợp lệ:</Label>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <div>• YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ</div>
                            <div>• YouTube Short: https://youtu.be/dQw4w9WgXcQ</div>
                            <div>• Vimeo: https://vimeo.com/123456789</div>
                            <div>• File trực tiếp: https://example.com/video.mp4</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="video-isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="video-isActive">Hiển thị video</Label>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading || (videoPreview && !isValidVideoUrl(videoPreview))}>
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
