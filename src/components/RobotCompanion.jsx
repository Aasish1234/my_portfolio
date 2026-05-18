import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function RobotCompanion() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Setup Scene specifically sized for a smaller container (not full screen)
    const scene = new THREE.Scene()
    
    // We make the camera aspect ratio fit a square box
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    // Size it to fit nicely on the home page (400x400 pixels)
    renderer.setSize(400, 400)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Build the Robot Group
    const robot = new THREE.Group()

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xaaaaaa, 
      metalness: 0.9, 
      roughness: 0.2,
      wireframe: true // Gives it a cool structural tech vibe
    })
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 1,
      roughness: 0.1
    })
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }) // Tailwind blue-500

    // The Core Body
    const coreGeo = new THREE.IcosahedronGeometry(1, 2)
    const core = new THREE.Mesh(coreGeo, coreMaterial)
    robot.add(core)

    // The Glowing Eye
    const eyeGeo = new THREE.SphereGeometry(0.4, 16, 16)
    const eye = new THREE.Mesh(eyeGeo, eyeMaterial)
    eye.position.z = 0.85 // Push it out to the front
    // We add the eye to a specific "head" group so we can rotate just the eye to follow the mouse
    const head = new THREE.Group()
    head.add(eye)
    robot.add(head)

    // Orbiting Rings
    const ringGeo1 = new THREE.TorusGeometry(1.6, 0.05, 16, 100)
    const ring1 = new THREE.Mesh(ringGeo1, metalMaterial)
    ring1.rotation.x = Math.PI / 2
    robot.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(2.0, 0.05, 16, 100)
    const ring2 = new THREE.Mesh(ringGeo2, metalMaterial)
    ring2.rotation.y = Math.PI / 3
    robot.add(ring2)

    scene.add(robot)

    // 3. Lighting (Crucial for metals)
    const ambient = new THREE.AmbientLight(0xffffff, 1)
    const directional = new THREE.DirectionalLight(0xffffff, 2)
    directional.position.set(5, 5, 5)
    scene.add(ambient, directional)

    camera.position.z = 6

    // 4. Mouse Tracking for the Eye
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e) => {
      // Normalize mouse coordinates from -1 to 1
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // 5. Animation Loop
    const clock = new THREE.Clock()
    let animationFrameId

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Float the whole robot up and down using a sine wave
      robot.position.y = Math.sin(time * 2) * 0.2

      // Spin the rings in opposite directions
      ring1.rotation.z = time * 0.5
      ring2.rotation.x = time * 0.3
      ring2.rotation.y = time * 0.2

      // Make the head/eye look at the mouse cursor
      // We use linear interpolation (lerp) so it moves smoothly, not instantly
      head.rotation.y += (mouseX * 0.8 - head.rotation.y) * 0.1
      head.rotation.x += (-mouseY * 0.8 - head.rotation.x) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    // 6. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      coreGeo.dispose()
      eyeGeo.dispose()
      ringGeo1.dispose()
      ringGeo2.dispose()
      metalMaterial.dispose()
      coreMaterial.dispose()
      eyeMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-[400px] h-[400px] flex items-center justify-center pointer-events-none"
    />
  )
}