import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const models = [
  { id: 'motion-control', name: 'Motion Control', icon: '🎬' },
  { id: 'standard', name: 'Standard', icon: '⚡' },
  { id: 'animation', name: 'Animation', icon: '✨' },
]

const aspectRatios = [
  { id: '16:9', label: '16:9', desc: 'Landscape' },
  { id: '9:16', label: '9:16', desc: 'Portrait' },
  { id: '1:1', label: '1:1', desc: 'Square' },
]

const resolutions = [
  { id: '720p', label: '720p', desc: 'HD' },
  { id: '1080p', label: '1080p', desc: 'Full HD' },
  { id: '4k', label: '4K', desc: 'Ultra HD' },
]

interface UploadBoxProps {
  label: string
  value: string | null
  onChange: (file: string | null) => void
}

const UploadBox: React.FC<UploadBoxProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-white/60 text-xs font-medium">{label}</span>
      <div className="relative group">
        {value ? (
          <div className="w-full h-24 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden relative">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <button 
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/90 transition-colors"
            >
              ✕
            </button>
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">{label}</span>
            </div>
          </div>
        ) : (
          <label className="w-full h-24 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-white/40 text-xs mt-2">Drop or upload</span>
            <input 
              type="file" 
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  onChange(URL.createObjectURL(file))
                }
              }}
            />
          </label>
        )}
      </div>
    </div>
  )
}

const Studio: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [duration, setDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [resolution, setResolution] = useState('1080p')
  const [startFrame, setStartFrame] = useState<string | null>(null)
  const [endFrame, setEndFrame] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedVideo('https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black font-body">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-white/10">
        <Link to="/" className="text-white font-medium text-lg font-display">Velorah<sup className="text-xs">®</sup></Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white/60 text-sm hover:text-white transition-colors">Home</Link>
          <span className="text-white text-sm font-medium">Studio</span>
          <button className="liquid-glass px-4 py-2 text-white text-sm font-medium rounded-full hover:scale-[1.03] transition-transform">
            Begin Journey
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Left Panel - Generation Controls */}
        <div className="w-[420px] border-r border-white/10 p-6 overflow-y-auto">
          <h2 className="text-white text-xl font-medium mb-6">Create</h2>
          
          {/* Model Selector */}
          <div className="flex flex-col gap-3 mb-6">
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Model</span>
            <div className="flex flex-col gap-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedModel === model.id 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{model.icon}</span>
                  {model.name}
                  {selectedModel === model.id && (
                    <svg className="ml-auto w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="flex flex-col gap-3 mb-6">
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Describe your vision</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic scene where dreams rise through the silence..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 text-sm resize-none outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Frame Upload */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <UploadBox label="Start Frame" value={startFrame} onChange={setStartFrame} />
            <UploadBox label="End Frame" value={endFrame} onChange={setEndFrame} />
          </div>

          {/* Controls */}
          <div className="space-y-6 mb-6">
            {/* Duration */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Duration</span>
                <span className="text-white text-sm">{duration}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/30">
                <span>1s</span>
                <span>Max 8s</span>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex flex-col gap-3">
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Aspect Ratio</span>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      aspectRatio === ratio.id
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{ratio.label}</div>
                    <div className="text-xs opacity-60">{ratio.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="flex flex-col gap-3">
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Resolution</span>
              <div className="grid grid-cols-3 gap-2">
                {resolutions.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setResolution(res.id)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      resolution === res.id
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{res.label}</div>
                    <div className="text-xs opacity-60">{res.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-4 bg-white text-black rounded-xl font-medium text-sm hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              'Begin Journey'
            )}
          </button>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-transparent">
          {generatedVideo ? (
            <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
              <video 
                src={generatedVideo} 
                autoPlay 
                loop 
                muted 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full max-w-2xl aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 bg-white/5">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <p className="text-white/40 text-sm">Your creation will emerge from the silence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Studio
