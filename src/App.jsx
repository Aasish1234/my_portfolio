import { useState, useEffect, useRef } from 'react'
import CustomCursor from './components/CustomCursor'
import Background3D from './components/Background3D'
import RobotCompanion from './components/RobotCompanion'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleScroll = (e) => {
    const target = e.currentTarget
    const totalScrollableHeight = target.scrollHeight - target.clientHeight
    if (totalScrollableHeight > 0) {
      setScrollProgress(target.scrollTop / totalScrollableHeight)
    }
  }

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
          <h1 className="text-xl font-semibold tracking-widest animate-pulse">HELLO VISITOR!...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950 text-white font-sans selection:bg-blue-500/30">
      <CustomCursor />
      <Background3D scrollProgress={scrollProgress} />

      {/* Floating Glassmorphism Header */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 flex justify-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full z-50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <button onClick={() => scrollToSection('home')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Home</button>
        <button onClick={() => scrollToSection('about')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">About</button>
        <button onClick={() => scrollToSection('experience')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Experience</button>
        <button onClick={() => scrollToSection('research')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Research</button>
        <button onClick={() => scrollToSection('skills')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Skills</button>
      </nav>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth relative z-10 hide-scrollbar"
      >
        {/* SLIDE 1: HOME */}
        <section id="home" className="h-screen w-full snap-start flex flex-col md:flex-row items-center justify-center p-6 gap-12">
          <div className="text-left max-w-2xl bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10">
            <h1 className="text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white via-gray-200 to-blue-500 bg-clip-text text-transparent">
              Hi, I'm Aasish
            </h1>
            <p className="text-xl text-blue-400 font-bold uppercase tracking-widest mb-4">
              Aspiring Software Engineer [cite: 2]
            </p>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Dedicated Computer Science student with a strong focus on ethics and self-improvement. Experienced in developing AI/ML and IoT solutions, with a focus on resilient, high-quality code. [cite: 6, 7]
            </p>
            <div className="mt-6 flex gap-4">
              <a href="mailto:aasishshrestha2005@gmail.com" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold transition-colors">Email Me</a> [cite: 5]
              <a href="https://github.com/Aasish1234" target="_blank" rel="noreferrer" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-colors">GitHub</a> [cite: 3]
            </div>
          </div>
          <div className="z-10 hidden md:block">
            <RobotCompanion />
          </div>
        </section>

        {/* SLIDE 2: ABOUT */}
        <section id="about" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 z-10">
            <div className="bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Education</h2>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-blue-400">University of Engineering & Management</h3> [cite: 9]
                <p className="text-sm text-gray-400 mb-1">B.Tech in Computer Science and Engineering</p> [cite: 10]
                <p className="text-xs text-gray-500">YGPA: 8.98 (1st Yr), 8.68 (2nd Yr)</p> [cite: 10]
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400">Don Bosco School, Bandel</h3> [cite: 11]
                <p className="text-xs text-gray-500">ISC: 85.5% | ICSE: 95.6%</p> [cite: 12]
              </div>
            </div>
            <div className="bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Beyond Code</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">▹</span>
                  <p>National Finalist at AI for Good Fest 2026 (IIIT-Delhi) and Square Hacks (IIT Delhi).</p> [cite: 57, 58]
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">▹</span>
                  <p>1st Prize in ML CANVAS 2.0 Poster Competition.</p> [cite: 59]
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">▹</span>
                  <p>5th-year certified Painter and district-level Athlete in Football & Table Tennis.</p> [cite: 60, 61]
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SLIDE 3: EXPERIENCE */}
        <section id="experience" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10">
            <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-800 pb-2">Experience</h2>
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-blue-500/30">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_#3b82f6]"></div>
                <h3 className="text-xl font-bold text-white">IoT Researcher & Developer Intern</h3> [cite: 21]
                <p className="text-blue-400 text-sm font-medium mb-2">IEDC UEM Kolkata | Aug 2025 - Present</p> [cite: 20, 23]
                <p className="text-gray-400 text-sm">Developed a predictive riverbank health model (97% accuracy) and architected the MITTIE IoT ecosystem for soil monitoring.</p> [cite: 24, 25]
              </div>
              <div className="relative pl-6 border-l border-blue-500/30">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5"></div>
                <h3 className="text-xl font-bold text-white">Machine Learning Intern</h3> [cite: 26]
                <p className="text-blue-400 text-sm font-medium mb-2">CodeAlpha | Jul 2025 - Aug 2025</p> [cite: 26, 28]
                <p className="text-gray-400 text-sm">Built transparent Credit Scoring and Healthcare diagnostic models using LIME/SHAP for "Glass-Box" decision-making.</p> [cite: 29]
              </div>
              <div className="relative pl-6 border-l border-transparent">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5"></div>
                <h3 className="text-xl font-bold text-white">Technical Staff Intern</h3> [cite: 31]
                <p className="text-blue-400 text-sm font-medium mb-2">GAOTek Inc. | Jun 2024 - Aug 2024</p> [cite: 30, 32]
                <p className="text-gray-400 text-sm">Leveraged Generative AI (LLMs) to automate Comparative Market Analysis and technical documentation.</p> [cite: 33]
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4: RESEARCH & PROJECTS */}
        <section id="research" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-4xl w-full z-10">
            <h2 className="text-4xl font-bold mb-6 text-white text-center drop-shadow-lg">Research & Projects</h2> [cite: 34, 39]
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-lg font-bold text-blue-400 mb-2">MITTIE (IoT & AI Agritech)</h3> [cite: 35]
                <p className="text-sm text-gray-300">Raspberry Pi-based system for real-time soil analysis and disease detection using voice-enabled chatbot integration.</p> [cite: 35]
              </div>
              <div className="bg-gray-900/60 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Coronary Artery Segmentation</h3> [cite: 37]
                <p className="text-sm text-gray-300">Glass-Box research using U-Net++ and Grad-CAM for medical diagnosis explainability. (Published Book Chapter in Nova Science Publishers)</p> [cite: 37, 40]
              </div>
              <div className="bg-gray-900/60 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors md:col-span-2">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Riverbank Health Prediction (XAI 2.0)</h3> [cite: 38, 42]
                <p className="text-sm text-gray-300">Implemented Attention-Based Neural Networks (97% accuracy) with Fuzzy Enhanced Feature Engineering. (Accepted Conference Paper at Springer ICDMIS 2025)</p> [cite: 38, 42]
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: SKILLS & CERTIFICATIONS */}
        <section id="skills" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-gray-900/40 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10">
            <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-800 pb-2">Technical Core</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Java', 'SQL', 'JavaScript', 'Git', 'Linux', 'Flask', 'Docker', 'Raspberry Pi'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300">{skill}</span>
                  ))} [cite: 16, 17]
                </div>
                <h3 className="text-xl font-bold text-blue-400 mt-6 mb-4">AI / ML Focus</h3> [cite: 18]
                <div className="flex flex-wrap gap-2">
                  {['Neural Networks', 'Explainable AI (XAI)', 'Computer Vision', 'Fuzzy Logic', 'Big Data'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-md text-sm text-blue-200">{skill}</span>
                  ))} [cite: 18]
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-4">Professional Certifications</h3> [cite: 45]
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span>AI Developer Professional</span> [cite: 46]
                    <span className="text-blue-500 font-semibold">IBM</span> [cite: 46]
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span>Cybersecurity Professional</span> [cite: 47]
                    <span className="text-blue-500 font-semibold">Google</span> [cite: 47]
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span>Generative AI for Developers</span> [cite: 48]
                    <span className="text-blue-500 font-semibold">IBM</span> [cite: 48]
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span>Applied Cryptography</span> [cite: 49]
                    <span className="text-blue-500 font-semibold">Univ. of Colorado</span> [cite: 49]
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Data Analysis Foundations</span> [cite: 55]
                    <span className="text-blue-500 font-semibold">IBM</span> [cite: 55]
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App