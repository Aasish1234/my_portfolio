import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background3D({ scrollProgress }) {
  const containerRef = useRef(null)
  // Store scroll progress in a mutable ref to access inside the animation loop safely
  const scrollRef = useRef(scrollProgress)

  useEffect(() => {
    scrollRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize 3D Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Build Constellation Geometry
    const particleCount = 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spread particles randomly through space
      positions[i] = (Math.random() - 0.5) * 16
      positions[i + 1] = (Math.random() - 0.5) * 16
      positions[i + 2] = (Math.random() - 0.5) * 16

      // Deep cosmic palette (deep blues and neon cyans)
      colors[i] = Math.random() * 0.15 
      colors[i + 1] = Math.random() * 0.4 + 0.2 
      colors[i + 2] = 1.0 
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    camera.position.z = 6

    // Mouse Interaction Tracking
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5
      mouseY = (e.clientY / window.innerHeight) - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Responsive Window Resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation Render Loop
    const clock = new THREE.Clock()
    let animationFrameId

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Idle rotational drifting
      particleSystem.rotation.y = elapsedTime * 0.03

      // Smooth mouse parallax interpolation
      particleSystem.rotation.x += (mouseY * 0.4 - particleSystem.rotation.x) * 0.05
      particleSystem.rotation.y += (mouseX * 0.4 - particleSystem.rotation.y) * 0.05

      // Dynamic camera path calculated entirely from scroll tracking
      const currentScroll = scrollRef.current
      camera.position.x = Math.sin(currentScroll * Math.PI * 1.5) * 3
      camera.position.y = -currentScroll * 6
      camera.position.z = 6 + Math.cos(currentScroll * Math.PI) * 2
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Teardown and Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />
}