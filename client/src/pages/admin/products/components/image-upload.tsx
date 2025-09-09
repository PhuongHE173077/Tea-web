"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Eye, Loader2, BookImage, BookDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { singleFileValidator } from "@/lib/utils"
import { createImageUrl } from "@/apis"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProductAdd } from "../types"

interface ImageUploadProps {
  single?: boolean
  multiple?: boolean
  product: ProductAdd
  setProduct: (p: ProductAdd) => void
}

export default function ImageUpload({ product, setProduct, single = false, multiple = false }: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)


  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    const error = singleFileValidator(file);
    if (error) {
      toast.error(error);
      return null;
    }

    let reqData = new FormData();
    reqData.append('image', file);

    try {
      const response = await toast.promise(
        createImageUrl(reqData),
        { pending: 'Đang tải ảnh lên...' }
      );
      e.target.value = '';
      return response.data;
    } catch (err) {
      toast.error("Upload thất bại");
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true)
    const image = await uploadImage(event);
    setProduct({
      ...product,
      product_images: [...product.product_images, image]
    })
    setIsUploading(false)
  }



  const onClosePreview = () => {
    setPreviewImage(null)
  }

  const handleDelete = (image: string) => {
    setProduct({
      ...product,
      product_images: product.product_images.filter(i => i !== image)
    })
  }

  const isThumb = (image) => {
    if (product.product_thumb === image) return true
    return false
  }

  const isCover = (image) => {
    if (product.product_cover === image) return true
    return false
  }

  return (
    <div className="space-y-4">

      <div className="test-sm font-bold">
        Ảnh sản phẩm
        <span className='text-red-500 text-sm'>*</span>
      </div>
      <div className="flex items-center gap-10">
        <div className="flex gap-3">
          <Card className={`border-2 w-5 border-yellow-500  hover:border-yellow-500 transition-colors `}>

            <div className="aspect-square flex items-center justify-center">
            </div>
          </Card>
          <div className="text-sm">
            Ảnh đại diện
          </div>
        </div>
        <div className="flex gap-3">
          <Card className={`border-2 w-5 border-blue-500  hover:border-blue-500 transition-colors`}>

            <div className="aspect-square flex items-center justify-center">
            </div>
          </Card>
          <div className="text-sm">
            Ảnh cover
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatePresence>
          {product.product_images?.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <Card className={`overflow-hidden ${isThumb(image) ? "border-yellow-500" : ""}  ${isCover(image) ? "border-blue-500" : ""}`}>
                <div className="aspect-square relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setPreviewImage(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(image)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <Card className={`border-2 border-dashed  hover:border-gray-400 transition-colors
          
          border-gray-300`}>
          <div className="aspect-square flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              className="h-full w-full flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500">Đang upload...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Tải ảnh lên</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={true}
        onChange={handleFileSelect}
        className="hidden"
      />



      {/* Image Preview Modal */}

      {
        previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClosePreview}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                width={800}
                height={600}
                className="object-contain max-h-[90vh] w-auto"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {previewImage == product.product_thumb && <span className="bg-yellow-200/90 text-yellow-900 text-xs font-medium px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  Ảnh đại diện
                </span>}
                {previewImage == product.product_cover && <span className="bg-green-200/90 text-green-900 text-xs font-medium px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  Ảnh cover
                </span>}
              </div>
              <TooltipProvider>
                <div className="absolute flex gap-3 top-2 right-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="shadow-md"
                        onClick={() => {
                          setProduct({
                            ...product,
                            product_thumb: previewImage
                          })
                        }}
                      >
                        <BookImage className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ảnh đại diện</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="shadow-md"
                        onClick={() => {
                          setProduct({
                            ...product,
                            product_cover: previewImage
                          })
                        }}
                      >
                        <BookDownIcon className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ảnh cover</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="shadow-md"
                        onClick={onClosePreview}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Đóng</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </motion.div>
          </motion.div>
        )
      }

    </div >
  )
}
