import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  Ruler, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Sparkles, 
  Cpu, 
  Maximize2, 
  RefreshCw, 
  Info,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Trash2,
  Upload
} from 'lucide-react';

export default function DicomViewer({ patient, openUploadModal }) {
  const canvasRef = useRef(null);
  const [sliceIndex, setSliceIndex] = useState(32);
  const [activePlane, setActivePlane] = useState('coronal'); // coronal | sagittal | axial
  const [windowPreset, setWindowPreset] = useState('meniscus-pdw'); // meniscus-pdw | bone-ct | soft-tissue | cartilage
  const [zoom, setZoom] = useState(1.0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  // Mask Layer Toggles
  const [showMasks, setShowMasks] = useState(true);
  const [maskOpacity, setMaskOpacity] = useState(0.65);
  const [layers, setLayers] = useState({
    femur: true,
    tibia: true,
    medialMeniscus: true,
    lateralMeniscus: true,
    cartilage: true,
  });

  // Caliper Tool State
  const [toolMode, setToolMode] = useState('none'); // 'none' | 'caliper'
  const [caliperPoints, setCaliperPoints] = useState([]); // [{x, y}, {x, y}]
  const [savedMeasurements, setSavedMeasurements] = useState([]);

  // Window Level / Width values
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(120);

  // Draw procedural anatomical slice on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, width, height);

    // Apply brightness/contrast filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Draw background noise/mri texture
    const imgData = ctx.createImageData(width, height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 8;
      const base = 12 + noise;
      imgData.data[i] = base;
      imgData.data[i + 1] = base + 2;
      imgData.data[i + 2] = base + 5;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    ctx.save();
    // Centering & zoom transformation
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const cx = width / 2;
    const cy = height / 2;
    const isCoronal = activePlane === 'coronal';
    const isSagittal = activePlane === 'sagittal';
    const isAxial = activePlane === 'axial';

    // 1. Draw Custom Uploaded Image if available, or procedural anatomy
    if (patient.customImageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = patient.customImageSrc;
      img.onload = () => {
        ctx.drawImage(img, cx - 180, cy - 180, 360, 360);
        // Draw segmentation masks on top
        if (showMasks) {
          ctx.globalAlpha = maskOpacity;
          if (isCoronal) drawCoronalMasks(ctx, width, height, patient, layers);
          else if (isSagittal) drawSagittalMasks(ctx, width, height, patient, layers);
          else drawAxialMasks(ctx, width, height, patient, layers);
          ctx.globalAlpha = 1.0;
        }
        drawCalipers(ctx, caliperPoints, savedMeasurements);
      };
      if (img.complete) {
        ctx.drawImage(img, cx - 180, cy - 180, 360, 360);
      }
    } else {
      if (isCoronal) {
        drawCoronalAnatomy(ctx, width, height, patient, sliceIndex);
      } else if (isSagittal) {
        drawSagittalAnatomy(ctx, width, height, patient, sliceIndex);
      } else {
        drawAxialAnatomy(ctx, width, height, patient, sliceIndex);
      }
    }

    // 2. Draw MONAI AI Segmentation Overlays if enabled
    if (showMasks) {
      ctx.globalAlpha = maskOpacity;
      if (isCoronal) {
        drawCoronalMasks(ctx, width, height, patient, layers);
      } else if (isSagittal) {
        drawSagittalMasks(ctx, width, height, patient, layers);
      } else {
        drawAxialMasks(ctx, width, height, patient, layers);
      }
      ctx.globalAlpha = 1.0;
    }

    // 3. Draw Scanline if AI inference is active
    if (isScanning) {
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 15;
      const scanY = (scanProgress / 100) * height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4. Draw Calipers
    drawCalipers(ctx, caliperPoints, savedMeasurements);

    ctx.restore();
  }, [patient, sliceIndex, activePlane, showMasks, maskOpacity, layers, zoom, brightness, contrast, caliperPoints, savedMeasurements, isScanning, scanProgress]);

  // Handle Caliper clicks
  const handleCanvasClick = (e) => {
    if (toolMode !== 'caliper') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (caliperPoints.length === 0) {
      setCaliperPoints([{ x, y }]);
    } else if (caliperPoints.length === 1) {
      const p1 = caliperPoints[0];
      const p2 = { x, y };
      // Calculate real millimeter distance (0.35 mm/pixel)
      const pixelDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const mmDist = +(pixelDist * 0.35).toFixed(1);

      setSavedMeasurements(prev => [...prev, { p1, p2, mmDist, id: Date.now() }]);
      setCaliperPoints([]);
    }
  };

  // Trigger simulated deep learning inference
  const triggerAiInference = () => {
    setIsScanning(true);
    setScanProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 40);
  };

  return (
    <div className="grid-dicom-layout">
      {/* Left Control Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Plane Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
            Multiplanar MPR Projection
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            {[
              { id: 'coronal', label: 'Coronal (Front)' },
              { id: 'sagittal', label: 'Sagittal (Side)' },
              { id: 'axial', label: 'Axial (Top)' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePlane(p.id)}
                style={{
                  padding: '0.5rem 0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: activePlane === p.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: activePlane === p.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: activePlane === p.id ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Window/Level Contrast Presets */}
        <div>
          <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
            Imaging Modality & Contrast
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {[
              { id: 'meniscus-pdw', label: 'Meniscus PD-W', b: 105, c: 135 },
              { id: 'bone-ct', label: 'Bone CT Window', b: 120, c: 160 },
              { id: 'soft-tissue', label: 'T2 Soft Tissue', b: 95, c: 110 },
              { id: 'cartilage', label: 'Cartilage Contrast', b: 110, c: 140 },
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setWindowPreset(preset.id);
                  setBrightness(preset.b);
                  setContrast(preset.c);
                }}
                style={{
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: windowPreset === preset.id ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  background: windowPreset === preset.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  color: windowPreset === preset.id ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* MONAI Segmentation Layers Toggle */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              MONAI AI Segmentation Masks
            </span>
            <button
              onClick={() => setShowMasks(!showMasks)}
              style={{ background: 'transparent', border: 'none', color: showMasks ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
            >
              {showMasks ? <Eye size={14} /> : <EyeOff size={14} />}
              {showMasks ? 'Visible' : 'Hidden'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[
              { key: 'medialMeniscus', label: 'Medial Meniscus (Target)', color: '#f59e0b', dice: patient.aiMetrics.diceMedialMeniscus },
              { key: 'femur', label: 'Distal Femur', color: '#00f2fe', dice: patient.aiMetrics.diceFemur },
              { key: 'tibia', label: 'Proximal Tibia', color: '#10b981', dice: patient.aiMetrics.diceTibia },
              { key: 'lateralMeniscus', label: 'Lateral Meniscus', color: '#a855f7', dice: patient.aiMetrics.diceLateralMeniscus },
              { key: 'cartilage', label: 'Articular Cartilage', color: '#38bdf8', dice: patient.aiMetrics.diceCartilage },
            ].map(layer => (
              <div 
                key={layer.key} 
                className="layer-item"
                style={{ opacity: showMasks && layers[layer.key] ? 1 : 0.45 }}
              >
                <div className="layer-info">
                  <span className="layer-color-dot" style={{ backgroundColor: layer.color, color: layer.color }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{layer.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {(layer.dice * 100).toFixed(0)}%
                  </span>
                  <input
                    type="checkbox"
                    checked={layers[layer.key]}
                    onChange={(e) => setLayers(prev => ({ ...prev, [layer.key]: e.target.checked }))}
                    style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mask Opacity Slider */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              <span>Overlay Opacity</span>
              <span>{Math.round(maskOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={maskOpacity}
              onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
              className="slider-custom"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* AI Inference Trigger */}
        <button
          className="btn-primary"
          onClick={triggerAiInference}
          disabled={isScanning}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {isScanning ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              <span>Segmenting Slice ({scanProgress}%)...</span>
            </>
          ) : (
            <>
              <Sparkles size={15} />
              <span>Re-Run MONAI AI Inference</span>
            </>
          )}
        </button>

      </div>

      {/* Center DICOM Viewport */}
      <div className="dicom-viewport-container">
        
        {/* Viewport Top Header */}
        <div className="dicom-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
              {patient.affectedKnee} Knee | {activePlane.toUpperCase()} VIEW
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              ({patient.pixelSpacing})
            </span>
          </div>

          {/* Viewport Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {openUploadModal && (
              <button
                onClick={openUploadModal}
                className="btn-outline btn-gemini"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}
                title="Upload custom knee scan, MRI/CT, or medical photo"
              >
                <Upload size={14} />
                <span>Upload Scan/Photo</span>
              </button>
            )}

            <button
              onClick={() => setToolMode(toolMode === 'caliper' ? 'none' : 'caliper')}
              className={`btn-outline ${toolMode === 'caliper' ? 'btn-gemini' : ''}`}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              title="Click two points to measure real anatomical thickness in millimeters"
            >
              <Ruler size={14} />
              <span>{toolMode === 'caliper' ? 'Caliper Active' : 'Caliper Tool'}</span>
            </button>

            {savedMeasurements.length > 0 && (
              <button
                onClick={() => setSavedMeasurements([])}
                className="btn-outline"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                title="Clear all caliper measurements"
              >
                <Trash2 size={14} />
              </button>
            )}

            <button
              onClick={() => setZoom(z => Math.min(2.5, +(z + 0.2).toFixed(1)))}
              className="btn-outline"
              style={{ padding: '0.35rem 0.5rem' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.6, +(z - 0.2).toFixed(1)))}
              className="btn-outline"
              style={{ padding: '0.35rem 0.5rem' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => { setZoom(1.0); setBrightness(100); setContrast(120); }}
              className="btn-outline"
              style={{ padding: '0.35rem 0.5rem' }}
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Viewport Canvas & HUD */}
        <div className="dicom-canvas-wrapper" onClick={handleCanvasClick}>
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="dicom-canvas"
          />

          {/* HUD Overlay Top-Left */}
          <div className="dicom-overlay-hud">
            <div>PATIENT: {patient.name.toUpperCase()}</div>
            <div>MRN: {patient.id}</div>
            <div>MOD: {patient.modality.split(' ')[0]} 3.0T</div>
            <div>SLICE: {sliceIndex} / {patient.sliceCount}</div>
            <div>THICKNESS: {patient.sliceThickness}</div>
          </div>

          {/* HUD Overlay Top-Right */}
          <div className="dicom-overlay-hud-right">
            <div style={{ color: 'var(--accent-cyan)' }}>MONAI 3D SWIN-UNETR</div>
            <div>DICE: {(patient.aiMetrics.meanDiceScore * 100).toFixed(1)}%</div>
            <div>LATENCY: {patient.aiMetrics.inferenceTimeMs} ms</div>
            <div>KL GRADE: {patient.klGrade}</div>
          </div>

          {/* Caliper Instruction Banner */}
          {toolMode === 'caliper' && (
            <div style={{
              position: 'absolute',
              bottom: 16,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--accent-cyan)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              color: 'var(--accent-cyan)',
              fontWeight: 600,
              pointerEvents: 'none'
            }}>
              {caliperPoints.length === 0 ? 'Click first anatomical landmark' : 'Click second landmark to complete measurement'}
            </div>
          )}
        </div>

        {/* Bottom Slice Scrubber */}
        <div className="dicom-controls-footer">
          <div className="slice-slider-row">
            <button
              onClick={() => setSliceIndex(s => Math.max(1, s - 1))}
              className="btn-outline"
              style={{ padding: '0.3rem 0.5rem' }}
            >
              <ChevronLeft size={16} />
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Anterior / Superior</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  Slice {sliceIndex} / {patient.sliceCount}
                </span>
                <span>Posterior / Inferior</span>
              </div>
              <input
                type="range"
                min="1"
                max={patient.sliceCount}
                value={sliceIndex}
                onChange={(e) => setSliceIndex(parseInt(e.target.value))}
                className="slider-custom"
              />
            </div>

            <button
              onClick={() => setSliceIndex(s => Math.min(patient.sliceCount, s + 1))}
              className="btn-outline"
              style={{ padding: '0.3rem 0.5rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Right Morphometry & AI Metrics Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Medial Meniscus Quick Metrics */}
        <div className="glass-panel kpi-card amber">
          <span className="kpi-title">Medial Meniscus Mean Height</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="kpi-number">{patient.morphometrics.medialMeniscus.meanThickness}</span>
            <span className="kpi-unit">mm</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: patient.morphometrics.medialMeniscus.meanThickness < 2.5 ? 'var(--accent-rose)' : 'var(--accent-emerald)', margin: 0, fontWeight: 600 }}>
            {patient.morphometrics.medialMeniscus.status}
          </p>
        </div>

        {/* Joint Space Width Card */}
        <div className="glass-panel kpi-card">
          <span className="kpi-title">Medial Compartment Joint Space</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="kpi-number">{patient.morphometrics.jointSpaceWidth.medialCompartment}</span>
            <span className="kpi-unit">mm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
            <span>Lateral JSW: {patient.morphometrics.jointSpaceWidth.lateralCompartment} mm</span>
            <span style={{ color: 'var(--accent-cyan)' }}>Ratio: {patient.morphometrics.jointSpaceWidth.jswRatio}</span>
          </div>
        </div>

        {/* Measured Calipers List */}
        {savedMeasurements.length > 0 && (
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Live Caliper Measurements
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                {savedMeasurements.length} Taken
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 160, overflowY: 'auto' }}>
              {savedMeasurements.map((m, idx) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Measurement #{idx + 1}</span>
                  <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{m.mmDist} mm</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deep Learning Segmentation QA Card */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
            <Cpu size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>MONAI Model Benchmark</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Architecture:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>3D Swin-UNETR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Framework:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>MONAI / PyTorch 2.4</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>95% Hausdorff Distance:</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{patient.aiMetrics.hausdorffDistance95} mm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Inference Latency:</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{patient.aiMetrics.inferenceTimeMs} ms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Procedural Anatomical Drawing Helpers for Coronal, Sagittal, and Axial views
function drawCoronalAnatomy(ctx, w, h, patient, slice) {
  const kl = patient.klGrade;
  const isSevere = kl >= 3;
  const cx = w / 2;
  const cy = h / 2;

  // 1. Distal Femur Bone (Cortical edge & spongiosa)
  ctx.fillStyle = '#2d3748';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  // Femoral shaft down to medial and lateral condyles
  ctx.moveTo(cx - 80, cy - 220);
  ctx.lineTo(cx - 80, cy - 100);
  // Medial Condyle
  ctx.bezierCurveTo(cx - 110, cy - 60, cx - 120, cy - 10, cx - 70, cy - 10);
  // Intercondylar notch
  ctx.bezierCurveTo(cx - 40, cy - 10, cx - 20, cy - 55, cx, cy - 55);
  ctx.bezierCurveTo(cx + 20, cy - 55, cx + 40, cy - 10, cx + 70, cy - 10);
  // Lateral Condyle
  ctx.bezierCurveTo(cx + 120, cy - 10, cx + 110, cy - 60, cx + 80, cy - 100);
  ctx.lineTo(cx + 80, cy - 220);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Proximal Tibia Bone
  const medialDefect = isSevere ? (kl === 4 ? 14 : 7) : 0;
  ctx.beginPath();
  // Tibial plateau
  ctx.moveTo(cx - 125, cy + 25 + medialDefect);
  // Medial plateau with sclerosis/defect
  ctx.lineTo(cx - 25, cy + 20 + (medialDefect * 0.5));
  // Tibial spines / intercondylar eminence
  ctx.lineTo(cx - 10, cy + 5);
  ctx.lineTo(cx + 10, cy + 5);
  // Lateral plateau
  ctx.lineTo(cx + 25, cy + 20);
  ctx.lineTo(cx + 125, cy + 22);
  // Shaft downwards
  ctx.lineTo(cx + 90, cy + 220);
  ctx.lineTo(cx - 90, cy + 220);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Fibula head
  ctx.beginPath();
  ctx.ellipse(cx + 140, cy + 85, 20, 35, Math.PI / 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 4. Medial Meniscus (Triangular fibrocartilage)
  const mmWear = patient.morphometrics.medialMeniscus.meanThickness;
  const extrusion = patient.morphometrics.medialMeniscus.extrusionDistance;
  ctx.fillStyle = '#0f172a'; // low signal black on PD-W
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;

  if (mmWear > 0.8) {
    ctx.beginPath();
    const mmX = cx - 110 - (extrusion * 2);
    ctx.moveTo(mmX, cy + 12);
    ctx.lineTo(mmX + (mmWear * 4.5), cy + 4);
    ctx.lineTo(mmX + (mmWear * 4.5), cy + 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 5. Lateral Meniscus
  ctx.beginPath();
  const lmX = cx + 110;
  ctx.moveTo(lmX, cy + 12);
  ctx.lineTo(lmX - 22, cy + 4);
  ctx.lineTo(lmX - 22, cy + 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawSagittalAnatomy(ctx, w, h, patient, slice) {
  const cx = w / 2;
  const cy = h / 2;

  ctx.fillStyle = '#2d3748';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;

  // Femur round condyle in sagittal cut
  ctx.beginPath();
  ctx.arc(cx, cy - 70, 75, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tibial plateau
  ctx.beginPath();
  ctx.ellipse(cx, cy + 80, 110, 45, 0, 0, Math.PI);
  ctx.lineTo(cx - 70, cy + 220);
  ctx.lineTo(cx + 70, cy + 220);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Patella
  ctx.beginPath();
  ctx.ellipse(cx - 105, cy - 75, 18, 40, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Anterior and Posterior Horns of Meniscus (Bow-tie wedges)
  ctx.fillStyle = '#0f172a';
  const antH = patient.morphometrics.medialMeniscus.anteriorHorn;
  const postH = patient.morphometrics.medialMeniscus.posteriorHorn;

  // Anterior horn
  ctx.beginPath();
  ctx.moveTo(cx - 75, cy + 20);
  ctx.lineTo(cx - 75 + (antH * 3.5), cy + 20 - (antH * 2.5));
  ctx.lineTo(cx - 75 + (antH * 3.5), cy + 20);
  ctx.closePath();
  ctx.fill();

  // Posterior horn
  ctx.beginPath();
  ctx.moveTo(cx + 75, cy + 20);
  ctx.lineTo(cx + 75 - (postH * 3.5), cy + 20 - (postH * 2.5));
  ctx.lineTo(cx + 75 - (postH * 3.5), cy + 20);
  ctx.closePath();
  ctx.fill();
}

function drawAxialAnatomy(ctx, w, h, patient, slice) {
  const cx = w / 2;
  const cy = h / 2;

  ctx.fillStyle = '#2d3748';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;

  // Femoral trochlea & condyles (AP / ML cross section)
  ctx.beginPath();
  ctx.ellipse(cx - 50, cy + 30, 45, 65, 0, 0, Math.PI * 2); // Medial Condyle
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx + 50, cy + 30, 45, 65, 0, 0, Math.PI * 2); // Lateral Condyle
  ctx.fill();
  ctx.stroke();

  // Anterior trochlear bridge
  ctx.beginPath();
  ctx.ellipse(cx, cy - 30, 55, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Patella
  ctx.beginPath();
  ctx.ellipse(cx, cy - 90, 40, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

// Segmentation Mask Overlays
function drawCoronalMasks(ctx, w, h, patient, layers) {
  const cx = w / 2;
  const cy = h / 2;
  const mmWear = patient.morphometrics.medialMeniscus.meanThickness;
  const extrusion = patient.morphometrics.medialMeniscus.extrusionDistance;

  // Femur Mask (Cyan)
  if (layers.femur) {
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy - 215);
    ctx.lineTo(cx - 75, cy - 95);
    ctx.bezierCurveTo(cx - 105, cy - 58, cx - 115, cy - 12, cx - 68, cy - 12);
    ctx.bezierCurveTo(cx - 38, cy - 12, cx - 18, cy - 52, cx, cy - 52);
    ctx.bezierCurveTo(cx + 18, cy - 52, cx + 38, cy - 12, cx + 68, cy - 12);
    ctx.bezierCurveTo(cx + 115, cy - 12, cx + 105, cy - 58, cx + 75, cy - 95);
    ctx.lineTo(cx + 75, cy - 215);
    ctx.closePath();
    ctx.fill();
  }

  // Tibia Mask (Emerald)
  if (layers.tibia) {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy + 28);
    ctx.lineTo(cx - 25, cy + 22);
    ctx.lineTo(cx - 10, cy + 8);
    ctx.lineTo(cx + 10, cy + 8);
    ctx.lineTo(cx + 25, cy + 22);
    ctx.lineTo(cx + 120, cy + 24);
    ctx.lineTo(cx + 85, cy + 215);
    ctx.lineTo(cx - 85, cy + 215);
    ctx.closePath();
    ctx.fill();
  }

  // Medial Meniscus Mask (Amber / Orange)
  if (layers.medialMeniscus && mmWear > 0.8) {
    ctx.fillStyle = '#f59e0b';
    const mmX = cx - 110 - (extrusion * 2);
    ctx.beginPath();
    ctx.moveTo(mmX, cy + 12);
    ctx.lineTo(mmX + (mmWear * 4.5), cy + 4);
    ctx.lineTo(mmX + (mmWear * 4.5), cy + 18);
    ctx.closePath();
    ctx.fill();
  }

  // Lateral Meniscus Mask (Purple)
  if (layers.lateralMeniscus) {
    ctx.fillStyle = '#a855f7';
    const lmX = cx + 110;
    ctx.beginPath();
    ctx.moveTo(lmX, cy + 12);
    ctx.lineTo(lmX - 22, cy + 4);
    ctx.lineTo(lmX - 22, cy + 18);
    ctx.closePath();
    ctx.fill();
  }

  // Cartilage Mask (Sky Blue)
  if (layers.cartilage) {
    ctx.fillStyle = '#38bdf8';
    // Medial femoral cartilage
    ctx.fillRect(cx - 105, cy - 10, 50, 4);
    // Lateral femoral cartilage
    ctx.fillRect(cx + 55, cy - 10, 50, 5);
  }
}

function drawSagittalMasks(ctx, w, h, patient, layers) {
  const cx = w / 2;
  const cy = h / 2;
  const antH = patient.morphometrics.medialMeniscus.anteriorHorn;
  const postH = patient.morphometrics.medialMeniscus.posteriorHorn;

  if (layers.femur) {
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(cx, cy - 70, 72, 0, Math.PI * 2);
    ctx.fill();
  }

  if (layers.tibia) {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 80, 105, 42, 0, 0, Math.PI);
    ctx.lineTo(cx - 65, cy + 215);
    ctx.lineTo(cx + 65, cy + 215);
    ctx.closePath();
    ctx.fill();
  }

  if (layers.medialMeniscus) {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy + 20);
    ctx.lineTo(cx - 75 + (antH * 3.5), cy + 20 - (antH * 2.5));
    ctx.lineTo(cx - 75 + (antH * 3.5), cy + 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 75, cy + 20);
    ctx.lineTo(cx + 75 - (postH * 3.5), cy + 20 - (postH * 2.5));
    ctx.lineTo(cx + 75 - (postH * 3.5), cy + 20);
    ctx.closePath();
    ctx.fill();
  }
}

function drawAxialMasks(ctx, w, h, patient, layers) {
  const cx = w / 2;
  const cy = h / 2;

  if (layers.femur) {
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.ellipse(cx - 50, cy + 30, 42, 62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 50, cy + 30, 42, 62, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Caliper Overlay Renderer
function drawCalipers(ctx, currentPoints, savedMeasurements) {
  ctx.strokeStyle = '#00f2fe';
  ctx.fillStyle = '#00f2fe';
  ctx.lineWidth = 2;
  ctx.font = '12px JetBrains Mono, monospace';

  // Draw in-progress point
  currentPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw completed measurements
  savedMeasurements.forEach(m => {
    const { p1, p2, mmDist } = m;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Cross ticks at endpoints
    [p1, p2].forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Distance Label
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2 - 8;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    const textWidth = ctx.measureText(`${mmDist} mm`).width;
    ctx.fillRect(midX - textWidth / 2 - 4, midY - 12, textWidth + 8, 16);

    ctx.fillStyle = '#00f2fe';
    ctx.fillText(`${mmDist} mm`, midX - textWidth / 2, midY);
  });
}
