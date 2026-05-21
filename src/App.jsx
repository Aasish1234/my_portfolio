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
      element.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-semibold tracking-widest animate-pulse">LOADING PORTFOLIO...</h1>
          <h1 className="text-xl font-semibold tracking-widest animate-pulse mt-2 text-blue-400">HELLO VISITOR!</h1>
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
        <button onClick={() => scrollToSection('experience')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Experience & Skills</button>
        <button onClick={() => scrollToSection('research')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Research</button>
        <button onClick={() => scrollToSection('recognition')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">Recognition</button>
        <button onClick={() => scrollToSection('about')} className="hover:text-white text-gray-300 transition-colors text-sm font-medium">About</button>
      </nav>

      {/* MAIN VERTICAL SCROLL CONTAINER */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* SLIDE 1: HOME */}
        <section id="home" className="h-screen w-full snap-start flex flex-col md:flex-row items-center justify-center p-6 gap-12">
          <div className="text-left max-w-2xl bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10">
            <h1 className="text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white via-gray-200 to-blue-500 bg-clip-text text-transparent">
              Hi, I'm Aasish
            </h1>
            <p className="text-xl text-blue-400 font-bold uppercase tracking-widest mb-4">
              Aspiring Software Engineer
            </p>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Dedicated Computer Science student with a strong focus on ethics and self-improvement. Experienced in developing AI/ML and IoT solutions, with a focus on resilient, high-quality code.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/Aasish_CV.pdf" download="Aasish_Shrestha_CV.pdf" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                Download CV
              </a>
              <a href="mailto:aasishshrestha2005@gmail.com" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-colors">
                Email Me
              </a>
              <a href="https://github.com/Aasish1234" target="_blank" rel="noreferrer" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-colors">
                GitHub
              </a>
            </div>
          </div>
          
          <div className="z-10 hidden md:block">
            <RobotCompanion />
          </div>
        </section>

        {/* SLIDE 2: HORIZONTAL TRACK (EXPERIENCE -> SKILLS) */}
        <section className="h-screen w-full snap-start flex overflow-x-scroll snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* 2A: EXPERIENCE (Horizontal Slide 1) */}
          <div id="experience" className="h-screen min-w-full snap-center flex items-center justify-center p-6 relative">
            <div className="absolute top-1/4 right-8 animate-pulse text-gray-400 text-sm tracking-widest hidden md:block">
              SCROLL RIGHT FOR SKILLS →
            </div>
            <div className="max-w-3xl w-full bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10">
              <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-800 pb-2">Experience</h2>
              <div className="space-y-8">
                <div className="relative pl-6 border-l border-blue-500/30">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_#3b82f6]"></div>
                  <h3 className="text-xl font-bold text-white">IoT Researcher & Developer Intern</h3> 
                  <p className="text-blue-400 text-sm font-medium mb-2">IEDC UEM Kolkata | Aug 2025 - Present</p> 
                  <p className="text-gray-400 text-sm">Developed a predictive riverbank health model (97% accuracy) and architected the TERRA-Insight IoT ecosystem for soil monitoring.</p> 
                </div>
                <div className="relative pl-6 border-l border-blue-500/30">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5"></div>
                  <h3 className="text-xl font-bold text-white">Machine Learning Intern</h3> 
                  <p className="text-blue-400 text-sm font-medium mb-2">CodeAlpha | Jul 2025 - Aug 2025</p> 
                  <p className="text-gray-400 text-sm">Built transparent Credit Scoring and Healthcare diagnostic models using LIME/SHAP for "Glass-Box" decision-making.</p> 
                </div>
                <div className="relative pl-6 border-l border-transparent">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5"></div>
                  <h3 className="text-xl font-bold text-white">Technical Staff Intern</h3> 
                  <p className="text-blue-400 text-sm font-medium mb-2">GAOTek Inc. | Jun 2024 - Aug 2024</p> 
                  <p className="text-gray-400 text-sm">Leveraged Generative AI (LLMs) to automate Comparative Market Analysis and technical documentation.</p> 
                </div>
              </div>
            </div>
          </div>

          {/* 2B: SKILLS (Horizontal Slide 2) */}
          <div id="skills" className="h-screen min-w-full snap-center flex items-center justify-center p-6 relative">
             <div className="absolute top-1/4 left-8 animate-pulse text-gray-400 text-sm tracking-widest hidden md:block">
              ← SCROLL LEFT FOR EXPERIENCE
            </div>
            <div className="max-w-3xl w-full bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10">
              <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-800 pb-2">Technical Core</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Java', 'SQL', 'JavaScript', 'Git', 'Linux', 'Flask', 'Docker', 'Raspberry Pi'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300">{skill}</span>
                    ))} 
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 mt-6 mb-4">AI / ML Focus</h3> 
                  <div className="flex flex-wrap gap-2">
                    {['Neural Networks', 'Explainable AI (XAI)', 'Computer Vision', 'Fuzzy Logic', 'Big Data'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded-md text-sm text-emerald-200">{skill}</span>
                    ))} 
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Professional Certifications</h3> 
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>AI Developer Professional</span> 
                      <span className="text-purple-400 font-semibold">IBM</span> 
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>Cybersecurity Professional</span> 
                      <span className="text-purple-400 font-semibold">Google</span> 
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>Generative AI for Developers</span> 
                      <span className="text-purple-400 font-semibold">IBM</span> 
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>Applied Cryptography</span> 
                      <span className="text-purple-400 font-semibold">Univ. of Colorado</span> 
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Data Analysis Foundations</span> 
                      <span className="text-purple-400 font-semibold">IBM</span> 
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3: RESEARCH & PROJECTS */}
        <section id="research" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-4xl w-full z-10">
            <h2 className="text-4xl font-bold mb-6 text-white text-center drop-shadow-lg">Research & Projects</h2> 
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-950/70 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-lg font-bold text-blue-400 mb-2">TERRA-Insight (Threshold-based Edge-computing Real-time Rural Analytics)</h3> 
                <p className="text-sm text-gray-300">Raspberry Pi-based system for real-time soil analysis and disease detection using voice-enabled chatbot integration.</p> 
              </div>
              <div className="bg-gray-950/70 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Coronary Artery Segmentation</h3> 
                <p className="text-sm text-gray-300">Glass-Box research using U-Net++ and Grad-CAM for medical diagnosis explainability. (Published Book Chapter in Nova Science Publishers)</p>
              </div>
              <div className="bg-gray-950/70 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors md:col-span-2">
                <h3 className="text-lg font-bold text-blue-400 mb-2">Riverbank Health Prediction (XAI 2.0)</h3> 
                <p className="text-sm text-gray-300">Implemented Attention-Based Neural Networks (97% accuracy) with Fuzzy Enhanced Feature Engineering. (Accepted Conference Paper at Springer ICDMIS 2025)</p> 
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4: RECOGNITION (NEW) */}
        <section id="recognition" className="h-screen w-full snap-start flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10 z-10 text-center">
            <div className="text-5xl mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">🏆</div>
            <h2 className="text-4xl font-bold mb-8 text-white border-b border-gray-800 pb-4 inline-block">Honors & Awards</h2>
            <div className="space-y-6 text-left max-w-2xl mx-auto">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
                <span className="text-yellow-500 text-xl">🥇</span>
                <div>
                  <h3 className="text-white font-bold text-lg">National Finalist - AI for Good Fest 2026</h3>
                  <p className="text-gray-400 text-sm">IIIT-Delhi. Recognized for the development of TERRA-Insight.</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
                <span className="text-yellow-500 text-xl">🚀</span>
                <div>
                  <h3 className="text-white font-bold text-lg">National Finalist - Square Hacks 2025</h3>
                  <p className="text-gray-400 text-sm">IIT Delhi. Delivered top-tier innovative solutions in competitive environments.</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
                <span className="text-yellow-500 text-xl">⭐</span>
                <div>
                  <h3 className="text-white font-bold text-lg">1st Prize - ML CANVAS 2.0</h3>
                  <p className="text-gray-400 text-sm">Awarded for excellence in machine learning visualization and system design.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: ABOUT & REVIEW BOX (MOVED TO BOTTOM) */}
        <section id="about" className="min-h-screen w-full snap-start flex flex-col items-center justify-center p-6 pt-24 pb-24 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 z-10 mb-12">
            <div className="bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10 md:col-span-2">
              <h2 className="text-3xl font-bold mb-4 text-white">About Me</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                I am a 3rd-year Computer Science and Engineering student at UEM Kolkata. My passion lies in engineering automated systems, specifically focusing on Explainable AI (XAI) and smart hardware integration. Beyond code, I am a 5th-year certified painter and a former football and table tennis team captain, bringing creativity and discipline into everything I build.
              </p>
            </div>
            
            <div className="bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-800 pb-2">Academics</h2>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-blue-400">UEM Kolkata</h3> 
                <p className="text-sm text-gray-400">B.Tech CSE | YGPA: 8.98 (1st Yr), 8.68 (2nd Yr)</p> 
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400">Don Bosco School, Bandel</h3> 
                <p className="text-xs text-gray-500">ISC: 85.5% | ICSE: 95.6%</p> 
              </div>
            </div>

            {/* REVIEW TEXT BOX */}
            <div className="bg-gray-950/70 p-8 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Leave a Review</h2>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <textarea 
                  placeholder="What did you think of the portfolio?" 
                  rows="3"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                ></textarea>
                <button type="submit" className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default App