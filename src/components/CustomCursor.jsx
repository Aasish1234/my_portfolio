import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', updateMousePosition)
    
    // Cleanup the event listener so it doesn't crash your browser
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return (
    <>
      {/* The main solid blue dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white-500 rounded-full pointer-events-none z-50"
        animate={{ 
          x: mousePosition.x - 8, // Offset by half the width to center it
          y: mousePosition.y - 8 
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      
      {/* The trailing hollow circle effect */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-white-400 rounded-full pointer-events-none z-40"
        animate={{ 
          x: mousePosition.x - 20, 
          y: mousePosition.y - 20 
        }}
        transition={{ type: 'spring', mass: 0.2, stiffness: 100, damping: 10 }}
      />
    </>
  )
}