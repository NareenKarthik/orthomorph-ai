import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers, 
  Sparkles, 
  Activity, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info
} from 'lucide-react';

export default function Knee3DReconstruction({ patient }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshesRef = useRef({});
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Layer Toggles
  const [showFemur, setShowFemur] = useState(true);
  const [showTibia, setShowTibia] = useState(true);
  const [showMedialMeniscus, setShowMedialMeniscus] = useState(true);
  const [showLateralMeniscus, setShowLateralMeniscus] = useState(true);
  const [showImplant, setShowImplant] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [showResectionPlanes, setShowResectionPlanes] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 540;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 26);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.2);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 0.8);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 50);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    // Create 3D Knee Root Group
    const kneeGroup = new THREE.Group();
    scene.add(kneeGroup);

    // 1. Build Distal Femur Mesh
    const femurGroup = new THREE.Group();
    
    // Femoral Shaft
    const shaftGeo = new THREE.CylinderGeometry(2.4, 3.2, 12, 32);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.1,
    });
    const shaft = new THREE.Mesh(shaftGeo, boneMat);
    shaft.position.y = 8;
    femurGroup.add(shaft);

    // Medial Condyle
    const medialCondyleGeo = new THREE.SphereGeometry(3.2, 32, 24);
    medialCondyleGeo.scale(1.1, 1.2, 1.4);
    const medialCondyle = new THREE.Mesh(medialCondyleGeo, boneMat);
    medialCondyle.position.set(-3.2, 2.5, -0.5);
    femurGroup.add(medialCondyle);

    // Lateral Condyle
    const lateralCondyleGeo = new THREE.SphereGeometry(3.0, 32, 24);
    lateralCondyleGeo.scale(1.05, 1.15, 1.35);
    const lateralCondyle = new THREE.Mesh(lateralCondyleGeo, boneMat);
    lateralCondyle.position.set(3.2, 2.5, -0.5);
    femurGroup.add(lateralCondyle);

    kneeGroup.add(femurGroup);
    meshesRef.current.femur = femurGroup;

    // 2. Build Proximal Tibia Mesh
    const tibiaGroup = new THREE.Group();
    
    // Tibial Shaft
    const tibiaShaftGeo = new THREE.CylinderGeometry(2.6, 1.8, 14, 32);
    const tibiaShaft = new THREE.Mesh(tibiaShaftGeo, boneMat);
    tibiaShaft.position.y = -9;
    tibiaGroup.add(tibiaShaft);

    // Tibial Plateau (Medial & Lateral surfaces)
    const plateauGeo = new THREE.CylinderGeometry(5.8, 4.2, 2.5, 32);
    plateauGeo.scale(1.2, 1.0, 0.95);
    const plateau = new THREE.Mesh(plateauGeo, boneMat);
    plateau.position.y = -2;
    tibiaGroup.add(plateau);

    // Fibula Head
    const fibulaGeo = new THREE.CylinderGeometry(1.0, 0.8, 12, 16);
    const fibula = new THREE.Mesh(fibulaGeo, boneMat);
    fibula.position.set(5.6, -8, -1.2);
    fibula.rotation.z = -0.08;
    tibiaGroup.add(fibula);

    kneeGroup.add(tibiaGroup);
    meshesRef.current.tibia = tibiaGroup;

    // 3. Build Medial Meniscus (C-shaped Torus Section with wear scaling)
    const mmThickness = patient.morphometrics.medialMeniscus.meanThickness;
    const mmGeo = new THREE.TorusGeometry(3.0, Math.max(0.2, (mmThickness / 5.2) * 0.7), 16, 32, Math.PI * 0.85);
    const mmMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.4
    });
    const medialMeniscus = new THREE.Mesh(mmGeo, mmMat);
    medialMeniscus.rotation.x = Math.PI / 2;
    medialMeniscus.rotation.z = Math.PI * 0.95;
    medialMeniscus.position.set(-3.0, -0.6, -0.2);
    kneeGroup.add(medialMeniscus);
    meshesRef.current.medialMeniscus = medialMeniscus;

    // 4. Build Lateral Meniscus
    const lmGeo = new THREE.TorusGeometry(2.8, 0.65, 16, 32, Math.PI * 0.9);
    const lmMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0x581c87,
      emissiveIntensity: 0.4
    });
    const lateralMeniscus = new THREE.Mesh(lmGeo, lmMat);
    lateralMeniscus.rotation.x = Math.PI / 2;
    lateralMeniscus.rotation.z = -Math.PI * 0.05;
    lateralMeniscus.position.set(3.0, -0.6, -0.2);
    kneeGroup.add(lateralMeniscus);
    meshesRef.current.lateralMeniscus = lateralMeniscus;

    // 5. Build Prosthetic Implant Group (TKA Femoral Shield + Tibial Tray + Poly Insert)
    const implantGroup = new THREE.Group();
    
    // Chrome Femoral Component Shield
    const implantMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      roughness: 0.15,
      metalness: 0.95,
    });
    const femoralShieldGeo = new THREE.TorusGeometry(3.8, 1.2, 16, 32, Math.PI);
    const femoralShield = new THREE.Mesh(femoralShieldGeo, implantMat);
    femoralShield.rotation.y = Math.PI / 2;
    femoralShield.position.set(0, 2.8, 0);
    implantGroup.add(femoralShield);

    // Titanium Tibial Baseplate Tray
    const trayGeo = new THREE.CylinderGeometry(5.2, 5.0, 0.6, 32);
    trayGeo.scale(1.15, 1.0, 0.9);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.85,
    });
    const tibialTray = new THREE.Mesh(trayGeo, trayMat);
    tibialTray.position.set(0, -1.8, 0);
    implantGroup.add(tibialTray);

    // Translucent UHMWPE Polyethylene Spacer
    const polyGeo = new THREE.CylinderGeometry(5.0, 4.8, 1.2, 32);
    polyGeo.scale(1.1, 1.0, 0.88);
    const polyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.1,
    });
    const polySpacer = new THREE.Mesh(polyGeo, polyMat);
    polySpacer.position.set(0, -0.9, 0);
    implantGroup.add(polySpacer);

    implantGroup.visible = false;
    kneeGroup.add(implantGroup);
    meshesRef.current.implant = implantGroup;

    // 6. Resection Planes (Distal femur & proximal tibia cut preview)
    const resectionGroup = new THREE.Group();
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const distalCutPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), planeMat);
    distalCutPlane.rotation.x = Math.PI / 2;
    distalCutPlane.position.y = 1.5;
    resectionGroup.add(distalCutPlane);

    const tibialCutPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    }));
    tibialCutPlane.rotation.x = Math.PI / 2 + 0.08; // 5 deg slope
    tibialCutPlane.position.y = -1.5;
    resectionGroup.add(tibialCutPlane);

    resectionGroup.visible = false;
    kneeGroup.add(resectionGroup);
    meshesRef.current.resection = resectionGroup;

    // Store root knee group for rotation
    meshesRef.current.root = kneeGroup;

    // Mouse Interaction Handlers
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !meshesRef.current.root) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      meshesRef.current.root.rotation.y += deltaX * 0.008;
      meshesRef.current.root.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(12, Math.min(45, cameraRef.current.position.z + e.deltaY * 0.02));
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    mount.addEventListener('wheel', onWheel);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDraggingRef.current && meshesRef.current.root) {
        meshesRef.current.root.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      mount.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [patient]);

  // Update visibility toggles
  useEffect(() => {
    if (meshesRef.current.femur) meshesRef.current.femur.visible = showFemur;
    if (meshesRef.current.tibia) meshesRef.current.tibia.visible = showTibia;
    if (meshesRef.current.medialMeniscus) meshesRef.current.medialMeniscus.visible = showMedialMeniscus;
    if (meshesRef.current.lateralMeniscus) meshesRef.current.lateralMeniscus.visible = showLateralMeniscus;
    if (meshesRef.current.implant) meshesRef.current.implant.visible = showImplant;
    if (meshesRef.current.resection) meshesRef.current.resection.visible = showResectionPlanes;
  }, [showFemur, showTibia, showMedialMeniscus, showLateralMeniscus, showImplant, showResectionPlanes]);

  const reset3DView = () => {
    if (meshesRef.current.root) {
      meshesRef.current.root.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 26);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
      
      {/* 3D Viewport Box */}
      <div className="glass-panel" style={{ overflow: 'hidden', position: 'relative', height: 580, display: 'flex', flexDirection: 'column' }}>
        
        {/* Viewport Top Bar */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 10, 
          padding: '0.75rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(7, 10, 19, 0.9) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'auto' }}>
            <Box size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              3D Anatomical & Prosthetic Biomechanics
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
            <button className="btn-outline" onClick={reset3DView} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} title="Reset 3D Camera">
              <RotateCcw size={13} />
              <span>Reset Orientation</span>
            </button>
          </div>
        </div>

        {/* WebGL Canvas Container */}
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

        {/* 3D Overlay Help Badge */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(3, 6, 12, 0.75)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none'
        }}>
          DRAG: Rotate 3D Axis | WHEEL: Zoom Depth | CLICK TOGGLES ON RIGHT
        </div>
      </div>

      {/* Right 3D Layer Controls & Surgical Planning */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Layer Toggles Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>3D Anatomical & Prosthetic Layers</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { label: 'Distal Femur', checked: showFemur, toggle: setShowFemur, color: '#e2e8f0' },
              { label: 'Proximal Tibia & Fibula', checked: showTibia, toggle: setShowTibia, color: '#94a3b8' },
              { label: `Medial Meniscus (${patient.morphometrics.medialMeniscus.meanThickness}mm)`, checked: showMedialMeniscus, toggle: setShowMedialMeniscus, color: '#f59e0b' },
              { label: 'Lateral Meniscus (4.5mm)', checked: showLateralMeniscus, toggle: setShowLateralMeniscus, color: '#a855f7' },
              { label: 'Patient-Specific Prosthesis (TKA)', checked: showImplant, toggle: setShowImplant, color: '#00f2fe', highlight: true },
              { label: 'Surgical Resection Cut Planes', checked: showResectionPlanes, toggle: setShowResectionPlanes, color: '#10b981' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="layer-item"
                style={{ 
                  background: item.highlight ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.02)',
                  borderColor: item.highlight ? 'var(--border-medium)' : 'var(--border-subtle)'
                }}
              >
                <div className="layer-info">
                  <span className="layer-color-dot" style={{ backgroundColor: item.color, color: item.color }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: item.highlight ? 700 : 500, color: item.highlight ? 'var(--accent-cyan)' : '#fff' }}>
                    {item.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.toggle(e.target.checked)}
                  style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Implant Specs Quick Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
            Recommended Prosthetic Assembly
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Femoral Component:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{patient.implantRecommendation.femoralSize}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tibial Baseplate:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>{patient.implantRecommendation.tibialSize}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Polyethylene Spacer:</span>
              <strong style={{ color: 'var(--accent-amber)' }}>{patient.implantRecommendation.polyethyleneThickness}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
