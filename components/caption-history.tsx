'use client'

interface HistoryItem {
  image: string
  caption: string
  timestamp: string
}

interface CaptionHistoryProps {
  history: HistoryItem[]
}

export function CaptionHistory({ history }: CaptionHistoryProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-slate-300 font-semibold text-sm">Recent Captions</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {history.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors cursor-pointer group"
          >
            <div className="flex gap-3 items-start">
              <img
                src={item.image || "/placeholder.svg"}
                alt="history"
                className="w-10 h-10 rounded object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-xs line-clamp-2 group-hover:text-white transition-colors">
                  {item.caption}
                </p>
                <p className="text-slate-500 text-xs mt-1">{item.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
