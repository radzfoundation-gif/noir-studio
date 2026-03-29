import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Studio from './pages/Studio'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play().catch(() => {})
  }, [])

  return (
    <video
      ref={videoRef}
      src={VIDEO_URL}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  )
}

const NavBar: React.FC = () => {
  return (
    <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      <Link 
        to="/" 
        className="text-white text-3xl tracking-tight font-display"
      >
        Velorah<sup className="text-xs">®</sup>
      </Link>
      
      <ul className="hidden md:flex items-center gap-8">
        <li>
          <Link to="/" className="text-white text-sm font-medium">
            Home
          </Link>
        </li>
        <li>
          <Link to="/studio" className="text-white/60 text-sm hover:text-white transition-colors">
            Studio
          </Link>
        </li>
        <li>
          <span className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
            About
          </span>
        </li>
        <li>
          <span className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
            Journal
          </span>
        </li>
        <li>
          <span className="text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
            Reach Us
          </span>
        </li>
      </ul>

      <Link to="/studio" className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white hover:scale-[1.03] transition-transform cursor-pointer">
        Begin Journey
      </Link>
    </nav>
  )
}

const Hero: React.FC = () => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 py-[90px]">
      <h1 
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal font-display text-white"
      >
        Where <em className="not-italic text-white/60">imagination</em> comes to <em className="not-italic text-white/60">life.</em>
      </h1>

      <p className="animate-fade-rise-delay text-white/60 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        Transform your ideas into stunning visuals. Describe your vision, and let our AI bring your creativity to life in seconds.
      </p>

      <Link to="/studio" className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-white mt-12 hover:scale-[1.03] transition-transform cursor-pointer">
        Start Creating
      </Link>
    </section>
  )
}

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-body">
      <VideoBackground />
      <NavBar />
      <Hero />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
