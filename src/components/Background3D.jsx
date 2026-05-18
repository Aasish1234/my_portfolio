import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background3D({ scrollProgress }) {
  const containerRef = useRef(null)
  const scrollRef = useRef(scrollProgress)

  // Keep scroll state updated without re-triggering the 3D scene setup
  useEffect(() => {
    scrollRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Setup Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Define the 3 Shapes (The Morph Targets)
    const particleCount = 2000
    const layouts = [[], [], []]

    // SHAPE 1: Lorenz Attractor (Home Page)
    let x = 0.01, y = 0, z = 0
    const a = 10, b = 28, c = 8.0 / 3.0, dt = 0.01
    for (let i = 0; i < particleCount; i++) {
      x += a * (y - x) * dt
      y += (x * (b - z) - y) * dt
      z += (x * y - c * z) * dt
      layouts[0].push(new THREE.Vector3(x * 0.6, y * 0.6 - 15, z * 0.6 - 15))
    }

    // SHAPE 2: Fibonacci Sphere (About Page)
    const radius = 14
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      layouts[1].push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ))
    }

    // SHAPE 3: 3D Matrix Grid (Skills Page)
    const size = Math.ceil(Math.pow(particleCount, 1/3)) // ~13
    const step = 3.5
    const offset = (size * step) / 2
    let p = 0
    for (let ix = 0; ix < size; ix++) {
      for (let iy = 0; iy < size; iy++) {
        for (let iz = 0; iz < size; iz++) {
          if (p < particleCount) {
            layouts[2].push(new THREE.Vector3(ix * step - offset, iy * step - offset, iz * step - offset))
            p++
          }
        }
      }
    }

    // 3. Build the InstancedMesh
    const geometry = new THREE.SphereGeometry(0.12, 8, 8) 
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6, // Start Tailwind Blue
      transparent: true, 
      opacity: 0.8 
    })
    
    const instancedMesh = new THREE.InstancedMesh(geometry, material, particleCount)
    const dummy = new THREE.Object3D()
    const group = new THREE.Group()
    group.add(instancedMesh)
    scene.add(group)

    camera.position.z = 30

    // Colors for the 3 sections (Blue -> Purple -> Emerald)
    const color1 = new THREE.Color(0x3b82f6)
    const color2 = new THREE.Color(0xa855f7)
    const color3 = new THREE.Color(0x10b981)

    // 4. Mouse Tracking for Parallax
    let mouseX = 0, mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5
      mouseY = (e.clientY / window.innerHeight) - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Responsive Resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // 5. High-Performance Animation Loop
    const clock = new THREE.Clock()
    const tempVec = new THREE.Vector3() // Pre-allocate to prevent memory leaks
    let animationFrameId

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()
      const scroll = scrollRef.current || 0

      // A. Calculate which two shapes to blend between based on scroll (0 to 1)
      let currentIndex = 0
      let nextIndex = 1
      let lerpFactor = 0

      if (scroll < 0.5) {
        // Scrolling from Slide 1 to 2
        currentIndex = 0
        nextIndex = 1
        lerpFactor = scroll * 2 
        material.color.lerpColors(color1, color2, lerpFactor)
      } else {
        // Scrolling from Slide 2 to 3
        currentIndex = 1
        nextIndex = 2
        lerpFactor = (scroll - 0.5) * 2 
        material.color.lerpColors(color2, color3, lerpFactor)
      }

      // Smooth out the transition using an easing formula (Ease-in-out)
      const easeFactor = lerpFactor < 0.5 
        ? 2 * lerpFactor * lerpFactor 
        : 1 - Math.pow(-2 * lerpFactor + 2, 2) / 2

      // B. Morph the particles mathematically
      const currentLayout = layouts[currentIndex]
      const nextLayout = layouts[nextIndex]

      for (let i = 0; i < particleCount; i++) {
        tempVec.lerpVectors(currentLayout[i], nextLayout[i], easeFactor)
        dummy.position.copy(tempVec)
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(i, dummy.matrix)
      }
      instancedMesh.instanceMatrix.needsUpdate = true

      // C. Gentle continuous rotation + Mouse Parallax
      group.rotation.y = elapsedTime * 0.1 + (mouseX * 0.2)
      group.rotation.x = elapsedTime * 0.05 + (mouseY * 0.2)

      renderer.render(scene, camera)
    }

    animate()

    // 6. Cleanup
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