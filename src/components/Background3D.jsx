import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background3D({ scrollProgress }) {
  const containerRef = useRef(null)
  const scrollRef = useRef(scrollProgress)

  useEffect(() => {
    scrollRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const particleCount = 2000
    // We now have 5 arrays for 5 pages
    const layouts = [[], [], [], [], []]

    // SHAPE 1: Fibonacci Sphere (Home)
    const scaleSphere = 14; 
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      layouts[0].push(new THREE.Vector3(
        scaleSphere * Math.cos(theta) * Math.sin(phi),
        scaleSphere * Math.sin(theta) * Math.sin(phi),
        scaleSphere * Math.cos(phi)
      ))
    }

    // SHAPE 2: DNA Double Helix (Experience)
    const radiusHelix = 6;
    const heightHelix = 35;
    const turns = 4;
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount; 
      const angle = t * Math.PI * 2 * turns;
      const yPos = (t - 0.5) * heightHelix;
      if (i % 2 === 0) {
        layouts[2].push(new THREE.Vector3(Math.cos(angle) * radiusHelix, yPos, Math.sin(angle) * radiusHelix));
      } else {
        layouts[2].push(new THREE.Vector3(Math.cos(angle + Math.PI) * radiusHelix, yPos, Math.sin(angle + Math.PI) * radiusHelix));
      }
    }

    // SHAPE 2: Lorenz Attractor (About)
    const scaleLorenz = 0.6;
    let x = 0.01, y = 0, z = 0
    const a = 10, b = 28, c = 8.0 / 3.0, dt = 0.01
    for (let i = 0; i < particleCount; i++) {
      x += a * (y - x) * dt
      y += (x * (b - z) - y) * dt
      z += (x * y - c * z) * dt
      layouts[1].push(new THREE.Vector3(x * scaleLorenz, (y - 25) * scaleLorenz, (z - 25) * scaleLorenz))
    }

    // SHAPE 4: The Torus (Projects & Research)
    const R = 12; 
    const r = 5;  
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      layouts[3].push(new THREE.Vector3(
        (R + r * Math.cos(v)) * Math.cos(u),
        (R + r * Math.cos(v)) * Math.sin(u),
        r * Math.sin(v)
      ));
    }

    // SHAPE 5: 3D Matrix Grid (Skills & Certifications)
    const scaleGrid = 3.5;
    const size = Math.ceil(Math.pow(particleCount, 1/3)) 
    const offset = (size * scaleGrid) / 2
    let p = 0
    for (let ix = 0; ix < size; ix++) {
      for (let iy = 0; iy < size; iy++) {
        for (let iz = 0; iz < size; iz++) {
          if (p < particleCount) {
            layouts[4].push(new THREE.Vector3(ix * scaleGrid - offset, iy * scaleGrid - offset, iz * scaleGrid - offset))
            p++
          }
        }
      }
    }

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

    let mouseX = 0, mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5
      mouseY = (e.clientY / window.innerHeight) - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    const clock = new THREE.Clock()
    const tempVec = new THREE.Vector3() 
    let animationFrameId
    let smoothedProgress = 0 

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()
      const targetScroll = scrollRef.current || 0

      smoothedProgress += (targetScroll - smoothedProgress) * 0.02

      // Dynamic calculation for 5 sections (0, 1, 2, 3, 4)
      const totalSections = 5;
      const progressPerSection = 1 / (totalSections - 1);
      
      let currentIndex = Math.floor(smoothedProgress / progressPerSection);
      currentIndex = Math.min(currentIndex, totalSections - 2); // Prevent out of bounds
      let nextIndex = currentIndex + 1;
      
      let lerpFactor = (smoothedProgress - (currentIndex * progressPerSection)) / progressPerSection;
      lerpFactor = Math.max(0, Math.min(1, lerpFactor));

      const easeFactor = lerpFactor < 0.5 ? 2 * lerpFactor * lerpFactor : 1 - Math.pow(-2 * lerpFactor + 2, 2) / 2

      const currentLayout = layouts[currentIndex]
      const nextLayout = layouts[nextIndex]

      for (let i = 0; i < particleCount; i++) {
        tempVec.lerpVectors(currentLayout[i], nextLayout[i], easeFactor)
        dummy.position.copy(tempVec)
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(i, dummy.matrix)
      }
      instancedMesh.instanceMatrix.needsUpdate = true

      group.rotation.y = elapsedTime * 0.1 + (mouseX * 0.2)
      group.rotation.x = elapsedTime * 0.05 + (mouseY * 0.2)

      renderer.render(scene, camera)
    }

    animate()

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