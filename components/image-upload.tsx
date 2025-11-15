'use client'

import { useRef } from 'react'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, disabled = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files && files[0]) {
      onImageSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      onImageSelect(files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-slate-600/30'
            : 'border-blue-400/50 hover:border-blue-400/80 hover:bg-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        <div className="space-y-3">
          <div className="text-5xl">📷</div>
          <div>
            <p className="text-white font-bold text-lg">Drop image here</p>
            <p className="text-slate-400 text-sm">or click to select</p>
          </div>
          <p className="text-slate-500 text-xs font-medium">
            JPG, PNG, WebP • Max 10MB
          </p>
        </div>
      </div>
    </>
  )
}
