import axiosCustomize from "@/services/axios.customize"

// Upload single image and return URL
export const createImageUrl = async (data: any) => {
    return await axiosCustomize.post('/images/upload', data)
}

// Upload multiple images and return URLs
export const createMultipleImageUrls = async (data: any) => {
    return await axiosCustomize.post('/images/upload-multiple', data)
}

// Helper function to upload single file and return URL string
export const uploadSingleImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await createImageUrl(formData)
    return response.data // API returns URL string directly
}

// Helper function to upload multiple files and return URL strings
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach(file => {
        formData.append('images', file)
    })

    const response = await createMultipleImageUrls(formData)
    return response.data // API returns array of URL strings directly
}

// Validate if a string is a valid image URL
export const isValidImageUrl = (url: string): boolean => {
    if (!url) return false

    // Check if it's a valid URL format
    try {
        new URL(url)
    } catch {
        return false
    }

    // Check if it has image extension or is from common image hosting services
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i
    const imageHosts = /(imgur|cloudinary|unsplash|pexels|pixabay|amazonaws|googleusercontent)/i

    return imageExtensions.test(url) || imageHosts.test(url)
}

// Get image preview URL (for broken images)
export const getImagePreviewUrl = (url: string, fallback?: string): string => {
    if (!url) return fallback || '/placeholder-image.jpg'
    return url
}

