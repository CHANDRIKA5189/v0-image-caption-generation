'use client'

import { useState } from 'react'

interface CaptionDisplayProps {
  caption: string
  confidence: number
  processingTime: number
  variations?: string[]
  imageUrl?: string
}

export function CaptionDisplay({
  caption,
  confidence,
  processingTime,
  variations = [],
  imageUrl = '',
}: CaptionDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [activeVariation, setActiveVariation] = useState(0)

  const handleCopy = () => {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = `Caption: ${caption}\nConfidence: ${Math.round(confidence * 100)}%\nProcessing Time: ${processingTime}ms`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'caption.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadJSON = () => {
    const data = {
      caption,
      confidence: Math.round(confidence * 100),
      processingTime,
      variations,
      generatedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'caption-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-400/30 rounded-xl p-6 space-y-5 hover:border-blue-400/50 transition-colors">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Generated Caption</p>
          <p className="text-white text-base leading-relaxed font-medium">{caption}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-5 border-t border-slate-600/30">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-blue-400 font-bold text-sm whitespace-nowrap">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Processing</p>
            <p className="text-white font-bold">{processingTime}ms</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex-1 min-w-[100px] px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 rounded-lg text-blue-400 text-sm font-medium transition-all duration-200"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 min-w-[100px] px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500/50 rounded-lg text-slate-300 text-sm font-medium transition-all duration-200"
          >
            TXT
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex-1 min-w-[100px] px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500/50 rounded-lg text-slate-300 text-sm font-medium transition-all duration-200"
          >
            JSON
          </button>
        </div>
      </div>

      {variations.length > 0 && (
        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Alternative Captions</p>
          <div className="space-y-2">
            {variations.map((variation, idx) => (
              <button
                key={idx}
                onClick={() => setActiveVariation(idx)}
                className={`w-full p-3 rounded-lg text-sm text-left transition-all duration-200 border ${
                  activeVariation === idx
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                    : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600/50'
                }`}
              >
                <span className="text-xs font-semibold text-slate-500 block mb-1">Variation {idx + 1}</span>
                {variation}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
