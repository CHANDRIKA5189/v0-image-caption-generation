import { CaptionGenerator } from '@/components/caption-generator'

export const metadata = {
  title: 'Image Caption Generator | AI-Powered Descriptions',
  description: 'Generate descriptive captions for your images using advanced AI technology',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CaptionGenerator />
    </main>
  )
}
