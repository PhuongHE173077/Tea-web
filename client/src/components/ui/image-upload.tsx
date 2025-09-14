"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, X } from "lucide-react"
import { uploadImageAPI } from "@/apis/category.apis"
import { toast } from "react-toastify"

interface ImageUploadProps {
    label: string
    value: string
    onChange: (url: string) => void
    placeholder?: string
    previewSize?: "sm" | "md" | "lg"
    disabled?: boolean
}

export default function ImageUpload({
    label,
    value,
    onChange,
    placeholder = "URL hình ảnh hoặc upload file",
    previewSize = "md",
    disabled = false
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const response = await uploadImageAPI(file)
            onChange(response.data)
            toast.success("Upload hình ảnh thành công!")
        } catch (error) {
            toast.error("Upload hình ảnh thất bại!")
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleClearImage = () => {
        onChange("")
    }

    const getPreviewSize = () => {
        switch (previewSize) {
            case "sm":
                return "w-8 h-8"
            case "md":
                return "w-16 h-16"
            case "lg":
                return "w-24 h-24"
            default:
                return "w-16 h-16"
        }
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                    disabled={disabled}
                />
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading || disabled}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading || disabled}
                        className="rounded-xl"
                    >
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                {value && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleClearImage}
                        disabled={disabled}
                        className="rounded-xl"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {value && (
                <div className="mt-2">
                    <img
                        src={value}
                        alt="Preview"
                        className={`${getPreviewSize()} object-cover rounded-lg border`}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                </div>
            )}
        </div>
    )
}
