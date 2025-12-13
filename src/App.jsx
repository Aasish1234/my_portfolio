import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { motion } from 'framer-motion';

// --- 3D BACKGROUND: "Neural Network" Particles ---
function ParticleField(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#0ea5e9"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// --- UI COMPONENTS ---

// 1. Section Container (Animated Fade-In)
const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, margin: "-100px" }}
    className="mb-24 relative z-10"
  >
    <h2 className="text-3xl font-bold text-primary mb-8 border-b border-gray-700 pb-2 inline-block">
      {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </motion.div>
);

// 2. Card Component (Supports Images & Hover Effects)
const Card = ({ title, subtitle, date, desc, tags, image }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10"
  >
    {/* Optional Image Block */}
    {image && (
      <div className="mb-4 overflow-hidden rounded-lg border border-gray-700">
        <img src={image} alt={title} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
      </div>
    )}

    <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-primary font-medium">{subtitle}</p>
      </div>
      {date && <span className="text-xs font-mono text-gray-400 bg-gray-900/80 px-2 py-1 rounded self-start">{date}</span>}
    </div>
    
    {desc && <p className="text-gray-300 text-sm leading-relaxed mb-4">{desc}</p>}
    
    {tags && (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    )}
  </motion.div>
);
import './App.css'
// --- MAIN APPLICATION ---
function App() {
  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
     <div className="bg-blue-500 text-white min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">
        Tailwind is working!
      </h1>
    </div> 
      {/* 3D Canvas Layer */}
      <div className="fixed inset-0 z-0 bg-dark">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <ParticleField />
          </Float>
        </Canvas>
      </div>

      {/* Scrollable Content Layer */}
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32 mt-20"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
            Aasish Shrestha
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
             B.Tech CSE Student | AI, Machine Learning & Explainable AI Researcher
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300 font-mono">
            <a href="mailto:aasishshrestha2005@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">
              📧 aasishshrestha2005@gmail.com
            </a>
            <span>•</span>
            <span>📍 Kolkata, India</span>
          </div>
        </motion.header>

        {/* SUMMARY */}
        <Section title="About Me">
          <div className="bg-gray-800/30 p-6 rounded-lg border-l-4 border-primary">
            <p className="text-gray-300 leading-relaxed text-lg">
              [cite_start]I am a B.Tech CSE (Core) student at the <strong>University of Engineering and Management, Kolkata</strong>[cite: 5, 29], 
              [cite_start]currently maintaining a <strong>CGPA of 9.43</strong>[cite: 7, 29]. My passion lies in Artificial Intelligence and Machine Learning, 
              [cite_start]specifically focusing on <strong>Explainable AI (XAI)</strong>[cite: 5]. [cite_start]I have a strong foundation in Python and Data Science [cite: 6]
              [cite_start]and have successfully presented multiple research papers at international conferences like ICDMIS and ICLETS[cite: 6, 39, 43].
            </p>
          </div>
        </Section>

        {/* WORK EXPERIENCE */}
        <Section title="Work Experience">
          <Card 
            title="Machine Learning Intern"
            subtitle="CodeAlpha (Remote)"
            date="Jul 2025 - Aug 2025"
            desc="Focused on Explainable AI and model training. Gained hands-on experience in data preprocessing, algorithm optimization, and evaluation of deep learning systems."
            tags={["Explainable AI", "Deep Learning", "Model Training"]}
          />
          <Card 
            title="Intern - IEDC"
            subtitle="University of Engineering & Management"
            date="Dec 2024 - Ongoing"
            desc="Part of the university's Innovation & Entrepreneurship Development Cell. Developing 'Typomatriz', an AI-based pictorial language translator. Handled project ideation and model training."
            tags={["Entrepreneurship", "AI Translation", "Innovation"]}
          />
          <Card 
            title="Intern"
            subtitle="GAO Tek Inc., USA"
            date="May 2024 - Aug 2024"
            desc="Contributed to AI-driven content creation and product marketing. Designed structured documentation and applied ML for text-based data generation and analytics."
            tags={["Content AI", "Analytics", "Marketing"]}
          />
        </Section>

        {/* PROJECTS */}
        <Section title="Key Projects">
          <Card 
            title="Typomatrix Pictorial Language Translator"
            subtitle="Wadhwani Entrepreneurship Program"
            desc="Designed a machine learning-based translator that converts pictorial inputs to text. Aims to enhance multilingual accessibility through deep learning and image recognition."
            tags={["Machine Learning", "Image Recognition", "Accessibility"]}
          />
          <Card 
            title="Online Voting Website"
            subtitle="Full Stack Development"
            desc="Created a secure online voting system using HTML, CSS, and JavaScript with database integration. Implemented authentication and real-time data storage using AI-backed validation."
            tags={["Web Dev", "Security", "AI Validation"]}
          />
        </Section>

        {/* PUBLICATIONS */}
        <Section title="Research & Publications">
          <div className="space-y-4">
            <div className="group bg-gray-800/30 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                Fuzzy Enhanced Feature Engineering for Riverbank Health Prediction
              </h4>
              <p className="text-gray-400 text-sm mt-2 italic">
                2nd International Conference on Data Mining and Information Security (ICDMIS 2025) - Springer Publication
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">Explainable AI 2.0</span>
                <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">Neural Networks</span>
              </div>
            </div>

            <div className="group bg-gray-800/30 p-5 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer">
              <h4 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                Revolutionizing Literacy by Groundbreaking Device
              </h4>
              <p className="text-gray-400 text-sm mt-2 italic">
                International Conference on English Learning and Teaching Skills (ICLETS 2024)
              </p>
            </div>
          </div>
        </Section>

        {/* EDUCATION */}
        <Section title="Education">
          <Card 
            title="B.Tech in Computer Science and Engineering"
            subtitle="University of Engineering and Management, Kolkata"
            date="2023 - 2027"
            desc="Current CGPA: 9.43. Secured 26th rank in 1st year with a CGPA of 9.09."
            tags={["CGPA: 9.43", "Rank: 26"]}
          />
          <Card 
            title="Intermediate / +2"
            subtitle="Don Bosco School, Bandel"
            date="2022"
            desc="Completed Higher Secondary education."
            tags={["Science Stream"]}
          />
        </Section>

        {/* ACHIEVEMENTS */}
        <Section title="Scholastic Achievements">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <ul className="list-disc pl-5 space-y-3 text-gray-300">
              <li>Secured <strong>26th rank</strong> in 1st year (2024).</li>
              <li>Achieved <strong>CGPA 9.09</strong> in 1st year and <strong>9.43</strong> in 2nd year.</li>
              <li>Recognized for consistent academic excellence and impactful research contributions in Explainable AI.</li>
              <li>Member of <strong>Arts Club</strong> and <strong>GeeksforGeeks Student Chapter</strong>, UEM Kolkata.</li>
            </ul>
          </div>
        </Section>

        {/* SKILLS */}
        <Section title="Technical Skills">
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
            <div className="mb-6">
              <h5 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Languages</h5>
              <div className="flex flex-wrap gap-2">
                {["Python", "Java", "C"].map(s => (
                  <span key={s} className="px-3 py-1 bg-blue-900/30 text-blue-200 rounded text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h5 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Core Technologies</h5>
              <div className="flex flex-wrap gap-2">
                {["Machine Learning", "Deep Learning", "Neural Networks", "Data Structures (DSA)"].map(s => (
                  <span key={s} className="px-3 py-1 bg-purple-900/30 text-purple-200 rounded text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Specialization</h5>
              <div className="flex flex-wrap gap-2">
                {["Explainable AI (XAI)", "Fuzzy Logic", "Prompt Engineering", "NumPy", "Matplotlib"].map(s => (
                  <span key={s} className="px-3 py-1 bg-emerald-900/30 text-emerald-200 rounded text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <footer className="text-center text-gray-600 text-sm py-12 border-t border-gray-800 mt-12">
          <p>© 2025 Aasish Shrestha. Built with React, Three.js & Tailwind CSS.</p>
        </footer>

      </main>
    </div>
  );
}

export default App;