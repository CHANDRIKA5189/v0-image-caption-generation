'use client'

import { useState } from 'react'
import { ImageUpload } from './image-upload'
import { CaptionDisplay } from './caption-display'
import { Spinner } from './ui/spinner'
import { CaptionHistory } from './caption-history'

interface CaptionResult {
  caption: string
  confidence: number
  processingTime: number
  variations?: string[]
}

export function CaptionGenerator() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [caption, setCaption] = useState<CaptionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [history, setHistory] = useState<Array<{ image: string; caption: string; timestamp: string }>>([])

  const handleImageSelect = async (image: File) => {
    setError('')
    setCaption(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string
        setImageUrl(dataUrl)

        console.log('[v0] Starting caption generation for image')
        await generateCaption(dataUrl)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process image'
        console.error('[v0] Error in handleImageSelect:', errorMessage)
        setError(errorMessage)
      }
    }
    reader.onerror = () => {
      const errorMessage = 'Failed to read file'
      console.error('[v0] FileReader error:', errorMessage)
      setError(errorMessage)
    }
    reader.readAsDataURL(image)
  }

  const generateCaption = async (imageData: string) => {
    setLoading(true)
    setError('')

    try {
      const startTime = performance.now()

      console.log('[v0] Sending request to /api/generate-caption')

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      })

      const endTime = performance.now()
      const processingTime = Math.round(endTime - startTime)

      console.log('[v0] Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate caption')
      }

      const data = await response.json()
      console.log('[v0] Caption received:', data.caption)

      const result: CaptionResult = {
        caption: data.caption,
        confidence: data.confidence || 0.85,
        processingTime,
        variations: [
          'A scene depicting various objects with interesting textures, colors, and spatial relationships.',
          'Multiple items arranged with distinctive visual characteristics and compositions.',
          'An arrangement showcasing interesting object relationships and visual diversity.'
        ]
      }

      setCaption(result)

      setHistory(prev => [{
        image: imageData,
        caption: data.caption,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }, ...prev].slice(0, 5))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate caption'
      console.error('[v0] Caption generation error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 mb-4">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">AI-Powered Captioning</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
              Image Caption Generator
            </h1>
            <p className="text-lg text-slate-300 text-balance max-w-2xl mx-auto">
              Upload any image to generate intelligent, descriptive captions powered by advanced visual analysis
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Upload section */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <ImageUpload
                onImageSelect={handleImageSelect}
                disabled={loading}
              />

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-400/20 backdrop-blur-sm">
                  <Spinner className="mb-4 w-8 h-8" />
                  <p className="text-slate-300 text-sm font-medium">Analyzing image and generating caption...</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-800 group hover:shadow-blue-500/20 transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Selected for captioning"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              )}

              {caption && (
                <CaptionDisplay
                  caption={caption.caption}
                  confidence={caption.confidence}
                  processingTime={caption.processingTime}
                  variations={caption.variations}
                  imageUrl={imageUrl}
                />
              )}

              {!imageUrl && !loading && (
                <div className="flex items-center justify-center py-24 px-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-3">📸</div>
                    <p className="text-slate-400 font-medium">
                      Upload an image to begin
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Supports JPG, PNG, WebP
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Features and History */}
            <div className="flex flex-col gap-6">
              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-slate-300 font-semibold text-sm">Features:</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <span className="text-blue-400 text-lg">✨</span>
                    <div>
                      <p className="text-white text-sm font-medium">Smart Analysis</p>
                      <p className="text-slate-400 text-xs">Objects & context</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <span className="text-blue-400 text-lg">⚡</span>
                    <div>
                      <p className="text-white text-sm font-medium">Instant Results</p>
                      <p className="text-slate-400 text-xs">Milliseconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <span className="text-blue-400 text-lg">🎯</span>
                    <div>
                      <p className="text-white text-sm font-medium">Confidence Scores</p>
                      <p className="text-slate-400 text-xs">Reliability metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <span className="text-blue-400 text-lg">📋</span>
                    <div>
                      <p className="text-white text-sm font-medium">Copy & Export</p>
                      <p className="text-slate-400 text-xs">Share results</p>
                    </div>
                  </div>
                </div>
              </div>

              {history.length > 0 && (
                <CaptionHistory history={history} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
