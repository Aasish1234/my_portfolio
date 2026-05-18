import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background3D({ scrollProgress }) {
  const containerRef = useRef(null)
  const scrollRef = useRef(scrollProgress)

  // Keep scroll state updated without re-triggering the whole 3D scene
  useEffect(() => {
    scrollRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Build the InstancedMesh (Exactly matching your DevTools screenshot)
    const particleCount = 2000
    const geometry = new THREE.SphereGeometry(0.12, 8, 8) 
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.8 
    })
    
    // InstancedMesh allows rendering 2000 copies of the sphere in a single draw call
    const instancedMesh = new THREE.InstancedMesh(geometry, material, particleCount)
    const dummy = new THREE.Object3D()

    // 3. Mathematical generation of the Lorenz Attractor shape
    let x = 0.01, y = 0, z = 0
    const a = 10, b = 28, c = 8.0 / 3.0
    const dt = 0.01

    for (let i = 0; i < particleCount; i++) {
      // Lorenz equations for chaotic movement mapping
      const dx = a * (y - x) * dt
      const dy = (x * (b - z) - y) * dt
      const dz = (x * y - c * z) * dt

      x += dx
      y += dy
      z += dz

      // Scale coordinates and apply them to the dummy object
      dummy.position.set(x * 0.6, y * 0.6 - 15, z * 0.6 - 15)
      dummy.updateMatrix()
      
      // Transfer the dummy's position to the specific instance
      instancedMesh.setMatrixAt(i, dummy.matrix)
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true
    
    // Add it to a group to match the screenshot structure
    const group = new THREE.Group()
    group.add(instancedMesh)
    scene.add(group)

    camera.position.z = 25

    // 4. Mouse Tracking for Parallax
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5
      mouseY = (e.clientY / window.innerHeight) - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    // 5. Responsive Resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // 6. Animation Loop
    const clock = new THREE.Clock()
    let animationFrameId

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Gentle continuous rotation of the attractor
      group.rotation.y = elapsedTime * 0.1
      group.rotation.z = elapsedTime * 0.05

      // Smooth mouse parallax interpolation
      group.rotation.x += (mouseY * 0.3 - group.rotation.x) * 0.05
      group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.05

      // Shift the camera based on how far down the page the user has scrolled
      const currentScroll = scrollRef.current || 0
      camera.position.y = -currentScroll * 30
      camera.position.z = 25 + (currentScroll * 15)
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // 7. Cleanup to prevent memory leaks
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