import { useState, useEffect, useRef } from 'react'
import CustomCursor from './components/CustomCursor'
import Background3D from './components/Background3D'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Calculate percentage scrolled within the main viewport container
  const handleScroll = (e) => {
    const target = e.currentTarget
    const totalScrollableHeight = target.scrollHeight - target.clientHeight
    if (totalScrollableHeight > 0) {
      setScrollProgress(target.scrollTop / totalScrollableHeight)
    }
  }

  // Smooth slide snapping helper via navigation clicks
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-semibold tracking-widest animate-pulse">LOADING PORTFOLIO...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950 text-white font-sans">
      <CustomCursor />
      
      {/* 3D Moving Canvas Layer */}
      <Background3D scrollProgress={scrollProgress} />

      {/* Floating Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 flex justify-center gap-8 p-6 bg-gradient-to-b from-gray-950/80 to-transparent backdrop-blur-sm z-30">
        <button onClick={() => scrollToSection('home')} className="hover:text-blue-400 transition-colors tracking-wide font-medium">Home</button>
        <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors tracking-wide font-medium">About</button>
        <button onClick={() => scrollToSection('skills')} className="hover:text-blue-400 transition-colors tracking-wide font-medium">Skills</button>
      </nav>

      {/* Slide Snap Container (PowerPoint Style Viewport) */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth relative z-10"
      >
        {/* SLIDE 1: HOME */}
        <section id="home" className="h-screen w-full snap-start flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-3xl bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-gray-800/50">
            <h1 className="text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white via-gray-200 to-blue-500 bg-clip-text text-transparent">
              Hi, I'm Aasish
            </h1>
            <p className="text-xl text-blue-400 font-medium uppercase tracking-widest mb-2">
              Computer Science & Engineering Student
            </p>
            <p className="text-gray-400 max-w-md mx-auto">
              Building next-generation full-stack architectures and integrated hardware systems.
            </p>
          </div>
        </section>

        {/* SLIDE 2: ABOUT */}
        <section id="about" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-2xl bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-gray-800/50">
            <h2 className="text-4xl font-bold mb-6 text-white border-b border-gray-800 pb-2">About Me</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              Currently pursuing a B.Tech degree within the Computer Science and Engineering department at UEM Kolkata. 
              My research focus is deeply rooted in engineering automated systems, specializing in smart agricultural development frameworks and Explainable AI (XAI) implementations.
            </p>
          </div>
        </section>

        {/* SLIDE 3: SKILLS */}
        <section id="skills" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-gray-800/50">
            <h2 className="text-4xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Technical Core</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="p-4 bg-gray-950/50 rounded-xl border border-gray-800/30">
                <h3 className="text-blue-400 font-semibold mb-1">Systems & Intelligence</h3>
                <p className="text-sm text-gray-400">IoT Hardware Assembly, TERRA-Insight Analytics, Explainable AI Frameworks (LIME, SHAP)</p>
              </div>
              <div className="p-4 bg-gray-950/50 rounded-xl border border-gray-800/30">
                <h3 className="text-blue-400 font-semibold mb-1">Web Architectures</h3>
                <p className="text-sm text-gray-400">React.js Single-Page Frameworks, Production Deployment, Tailwind CSS Interfaces</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App