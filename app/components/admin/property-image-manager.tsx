"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { FileUpload } from "@/app/components/ui/file-upload"
import { Trash2, Star, Upload } from "lucide-react"
import Image from "next/image"

interface PropertyImageManagerProps {
  images: string[]
  contractAddress: string
  onImageAdd: (imageUrl: string) => void
  onImageRemove: (imageUrl: string) => void
  onSetPrimary?: (imageUrl: string) => void
}

export function PropertyImageManager({
  images,
  contractAddress,
  onImageAdd,
  onImageRemove,
  onSetPrimary
}: PropertyImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadSuccess = (results: any[]) => {
    results.forEach(result => {
      if (result.url) {
        onImageAdd(result.url)
      }
    })
    setIsUploading(false)
  }

  return (
    <div className="space-y-4">
      {/* Current Images Grid */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                <Image
                  src={imageUrl}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Image Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onSetPrimary && index !== 0 && (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onSetPrimary(imageUrl)}
                    title="Set as primary image"
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onImageRemove(imageUrl)}
                  title="Remove image"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload New Images */}
      <FileUpload
        bucket="property-images"
        pathPrefix={`properties/${contractAddress}`}
        accept="image/*"
        multiple={true}
        maxFiles={10}
        onUploadSuccess={handleUploadSuccess}
      >
        <div className="p-6 text-center">
          <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Upload Property Images
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            Drag and drop images here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports: JPG, PNG, WebP, GIF (max 5MB each)
          </p>
        </div>
      </FileUpload>
    </div>
  )
}
