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

    // SHAPE 1: Fibonacci Sphere (Home Page)
    // TWEAK THIS NUMBER: Lower is smaller (e.g., 8), Higher is bigger (e.g., 20)
    const scaleSphere = 20; 
    
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      layouts[0].push(new THREE.Vector3(
        scaleSphere * Math.cos(theta) * Math.sin(phi),
        scaleSphere * Math.sin(theta) * Math.sin(phi),
        scaleSphere * Math.cos(phi)
      ))
    }

    // SHAPE 2: Lorenz Attractor (About Page)
    // TWEAK THIS NUMBER: Lower is smaller (e.g., 0.3), Higher is bigger (e.g., 1.0)
    const scaleLorenz = 1.5;
    
    let x = 0.01, y = 0, z = 0
    const a = 10, b = 28, c = 8.0 / 3.0, dt = 0.01
    for (let i = 0; i < particleCount; i++) {
      x += a * (y - x) * dt
      y += (x * (b - z) - y) * dt
      z += (x * y - c * z) * dt
      // Note: We also multiply the -15 offset by the scale to keep it perfectly centered!
      layouts[1].push(new THREE.Vector3(
        x * scaleLorenz, 
        (y - 25) * scaleLorenz, 
        (z - 25) * scaleLorenz
      ))
    }

    // SHAPE 3: 3D Matrix Grid (Skills Page)
    //  TWEAK THIS NUMBER: Lower is smaller (e.g., 2), Higher is bigger (e.g., 5)
    const scaleGrid = 5;
    
    const size = Math.ceil(Math.pow(particleCount, 1/3)) // ~13
    const offset = (size * scaleGrid) / 2
    let p = 0
    for (let ix = 0; ix < size; ix++) {
      for (let iy = 0; iy < size; iy++) {
        for (let iz = 0; iz < size; iz++) {
          if (p < particleCount) {
            layouts[2].push(new THREE.Vector3(
              ix * scaleGrid - offset, 
              iy * scaleGrid - offset, 
              iz * scaleGrid - offset
            ))
            p++
          }
        }
      }
    }

    // 3. Build the InstancedMesh (Small, White, Glowing)
    const geometry = new THREE.SphereGeometry(0.04, 8, 8) 
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.7, 
      blending: THREE.AdditiveBlending, 
      depthWrite: false 
    })
    
    const instancedMesh = new THREE.InstancedMesh(geometry, material, particleCount)
    const dummy = new THREE.Object3D()
    const group = new THREE.Group()
    group.add(instancedMesh)
    scene.add(group)

    camera.position.z = 30

    // Colors locked to pure white
    const colorWhite = new THREE.Color(0xffffff)

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
    const tempVec = new THREE.Vector3() 
    let animationFrameId
    let smoothedProgress = 0 // Tracks the slow catch-up morphing

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()
      
      // Get the actual scroll position (0 to 1)
      const targetScroll = scrollRef.current || 0

      // Slowly move smoothedProgress towards the actual scroll position (0.02 speed)
      smoothedProgress += (targetScroll - smoothedProgress) * 0.02

      // A. Calculate which two shapes to blend between based on the SMOOTHED progress
      let currentIndex = 0
      let nextIndex = 1
      let lerpFactor = 0

      if (smoothedProgress < 0.5) {
        // Scrolling from Slide 1 to 2
        currentIndex = 0
        nextIndex = 1
        lerpFactor = smoothedProgress * 2 
        material.color.lerpColors(colorWhite, colorWhite, lerpFactor)
      } else {
        // Scrolling from Slide 2 to 3
        currentIndex = 1
        nextIndex = 2
        lerpFactor = (smoothedProgress - 0.5) * 2 
        material.color.lerpColors(colorWhite, colorWhite, lerpFactor)
      }

      // Smooth out the transition using an easing formula
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