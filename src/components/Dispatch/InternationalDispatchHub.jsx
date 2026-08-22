import React, { useState } from 'react';
import {
  Globe,
  Plane,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Thermometer,
  FileCheck,
  Download,
  Barcode,
  Package,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MapPin,
  Box
} from 'lucide-react';

export const COUNTRIES_CONFIG = [
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    hospital: 'Charité - Universitätsmedizin Berlin (Adult Knee Reconstruction)',
    regulatory: 'CE MDR (EU 2017/745) Class III Custom Implant',
    carrier: 'DHL Medical Cold-Chain Priority Express',
    transitTime: '24-48 Hours',
    hubCity: 'Berlin / Frankfurt MedTech Hub',
  },
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    hospital: 'Hospital for Special Surgery (HSS), New York, NY',
    regulatory: 'US FDA 510(k) Cleared Custom Medical Device',
    carrier: 'FedEx HealthCare Priority Direct',
    transitTime: '18-36 Hours',
    hubCity: 'New York / Memphis Global Hub',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    hospital: 'Royal National Orthopaedic Hospital (RNOH), Stanmore',
    regulatory: 'UK MHRA Medical Device Authorized',
    carrier: 'DHL Express Medical Cold-Chain',
    transitTime: '24-48 Hours',
    hubCity: 'London Heathrow Gateway',
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    hospital: 'Apollo Center of Orthopedic Excellence, New Delhi',
    regulatory: 'CDSCO Medical Device Class D Custom License',
    carrier: 'Blue Dart Medical Priority Logistics',
    transitTime: '36-48 Hours',
    hubCity: 'New Delhi / Bengaluru MedTech Hub',
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    hospital: 'University of Tokyo Hospital (Joint Replacement Division)',
    regulatory: 'PMDA Japan Arthroplasty Certified Class IV',
    carrier: 'Yamato Medical Express Cold-Chain',
    transitTime: '24-36 Hours',
    hubCity: 'Tokyo Haneda International Gateway',
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    hospital: 'Royal Prince Alfred Hospital, Sydney Orthopedic Center',
    regulatory: 'TGA Australia Custom Medical Device Registry',
    carrier: 'Qantas Freight Medical Priority',
    transitTime: '36-60 Hours',
    hubCity: 'Sydney Kingsford Smith Hub',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    hospital: 'Cleveland Clinic Abu Dhabi (Musculoskeletal Institute)',
    regulatory: 'MOHAP UAE Orthopedic Gateway Approved',
    carrier: 'Emirates SkyCargo Pharma Priority',
    transitTime: '24-36 Hours',
    hubCity: 'Dubai / Abu Dhabi Logistics Zone',
  },
  {
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    hospital: 'Singapore General Hospital (SGH) Orthopaedic Surgery',
    regulatory: 'HSA Singapore Medical Device Class C/D',
    carrier: 'Singapore Airlines Cargo Pharma Direct',
    transitTime: '20-36 Hours',
    hubCity: 'Singapore Changi Air Hub',
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    hospital: 'Universitätsspital Zürich (Klinik für Orthopädie)',
    regulatory: 'Swissmedic MedTech Compliant Standard',
    carrier: 'Swiss WorldCargo Temp-Controlled',
    transitTime: '24-36 Hours',
    hubCity: 'Zurich International Gateway',
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    hospital: 'Hôpital Pitié-Salpêtrière (Service de Chirurgie Orthopédique), Paris',
    regulatory: 'ANSM France & CE MDR 2017/745 Class III',
    carrier: 'Air France Cargo Medical Life Sciences',
    transitTime: '24-48 Hours',
    hubCity: 'Paris Charles de Gaulle Air Gateway',
  },
];

export const SURGICAL_ELEMENTS = [
  {
    id: 'psi-cutting-guides',
    name: 'Custom 3D Titanium Patient-Specific (PSI) Bone Cutting Guides',
    category: 'Patient-Specific Instrumentation (PSI)',
    material: 'Medical-Grade Ti-6Al-4V ELI (Direct Metal Laser Sintered)',
    sterility: 'Gamma Irradiated / SAL 10^-6 / Cleanroom Double-Pouched',
    leadTime: '72 Hours Cleanroom Fabrication',
    icon: Layers,
    description: 'Precision-contoured anatomical guides matching patient femoral and tibial osteophyte geometry for exact 0.5mm resection accuracy.',
  },
  {
    id: 'personalized-implant',
    name: 'Personalized Custom Knee Prosthesis (Femoral Component & Tibial Baseplate)',
    category: 'Custom Implant Prosthesis',
    material: 'Forged Co-Cr-Mo & Porous Titanium Trabecular Plasma Coating',
    sterility: 'Gamma Irradiated / Vacuum Nitrogen Encapsulated',
    leadTime: '96 Hours Direct Precision Sintering',
    icon: Box,
    description: 'Tailored femoral AP/ML aspect ratio with individualized rotational alignment and kinematic resection targets.',
  },
  {
    id: 'meniscal-allograft',
    name: 'Cryopreserved Allograft Meniscal Tissue Scaffold & Anchor Wedge',
    category: 'Biologic Tissue Allograft',
    material: 'Deep-Frozen Human Donor Meniscal Scaffold (-80°C)',
    sterility: 'Sterile Bioclean Cryo-Preserved (AATB / EATB Accredited)',
    leadTime: 'Immediate Cryo-Consignment Dispatch',
    icon: Thermometer,
    description: 'Anatomically matched medial/lateral meniscal matrix to restore shock absorption and prevent further subchondral bone stress.',
  },
  {
    id: 'poly-insert',
    name: 'Sub-Millimeter High-Crosslinked Polyethylene (XLPE) Joint Line Spacer',
    category: 'Kinematic Articular Insert',
    material: 'Vitamin E Stabilized Highly Cross-Linked Polyethylene (AOX™)',
    sterility: 'Sterile Gas Plasma Treated',
    leadTime: '48 Hours Rapid Cleanroom Milling',
    icon: Package,
    description: 'Precision thickness (10mm - 14mm) compensating for medial bone defects without over-tensioning the collateral ligaments.',
  },
];

export default function InternationalDispatchHub({ activePatient }) {
  const dispatchInfo = activePatient?.internationalDispatch || {};
  const currentCountry = COUNTRIES_CONFIG.find(c => c.name === dispatchInfo.country) || COUNTRIES_CONFIG[0];
  const currentElement = SURGICAL_ELEMENTS.find(e => e.name.includes(dispatchInfo.dispatchedElement) || dispatchInfo.dispatchedElement?.includes(e.name)) || SURGICAL_ELEMENTS[0];

  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [selectedElement, setSelectedElement] = useState(currentElement);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'element-specs' | 'manifest'
  const [isCopied, setIsCopied] = useState(false);

  const trackingId = dispatchInfo.trackingNumber || `MED-EXP-${activePatient?.id?.replace('PAT-', '') || '84920'}-${selectedCountry.code}`;

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadManifest = () => {
    const manifestText = `
================================================================================
    ORTHOMORPH AI — INTERNATIONAL SURGICAL DISPATCH MANIFEST
================================================================================
PATIENT IDENTIFICATION:
  Patient Name:       ${activePatient?.name || 'Eleanor Vance'}
  Case Reference ID:  ${activePatient?.id || 'PAT-84920'}
  Age / Sex:          ${activePatient?.age || 67}y / ${activePatient?.sex || 'Female'}
  Blood Group:        ${activePatient?.biodata?.bloodGroup || 'A+'}
  Affected Joint:     ${activePatient?.affectedKnee || 'Right'} Knee (KL Grade ${activePatient?.klGrade || 4})
  Attending Surgeon:  ${activePatient?.attendingSurgeon || 'Dr. Alistair Sterling, MD, FRCS (Ortho)'}

CROSS-BORDER OPERATION DESTINATION:
  Destination Country:    ${selectedCountry.flag} ${selectedCountry.name} (${selectedCountry.code})
  Destination Hospital:   ${selectedCountry.hospital}
  Regional Hub:           ${selectedCountry.hubCity}
  International Carrier:  ${selectedCountry.carrier}
  Consignment Tracking:   ${trackingId}

DISPATCHED SURGICAL ELEMENT:
  Element Name:       ${selectedElement.name}
  Category:           ${selectedElement.category}
  Material Spec:      ${selectedElement.material}
  Sterility Standard: ${selectedElement.sterility}
  Regulatory Seal:    ${selectedCountry.regulatory}
  Cold-Chain Status:  -80°C Cryo-Monitored / Active Temp Logger #DE-89

DISPATCH TIMELINE:
  CAD / 3D Reconstruction: COMPLETED & MONAI Swin-UNETR Verified
  Cleanroom Sintering:     COMPLETED (Ti-6Al-4V DMLS)
  Sterile Nitrogen Seal:   VERIFIED
  Customs Clearance:       AUTHORIZED (${selectedCountry.regulatory})
  Estimated OR Arrival:    48 Hours prior to scheduled surgery
================================================================================
`;
    const blob = new Blob([manifestText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Surgical_Dispatch_Manifest_${activePatient?.id || 'PAT-84920'}_${selectedCountry.code}.txt`;
    a.click();
    URL.revokeObjectURL(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
      
      {/* Top Banner: Cross-Border Operation Overview */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12), rgba(15, 23, 42, 0.85), rgba(79, 172, 254, 0.08))',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 30px rgba(0, 242, 254, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.35)',
            fontSize: '1.8rem',
          }}>
            {selectedCountry.flag}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="brand-badge" style={{ fontSize: '0.72rem', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)' }}>
                🌐 Cross-Border Surgical Logistics
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Destination: <strong style={{ color: '#fff' }}>{selectedCountry.name}</strong>
              </span>
              <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                {selectedCountry.regulatory}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '6px 0 2px', color: '#fff' }}>
              {selectedElement.name}
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Patient: <strong style={{ color: '#fff' }}>{activePatient?.name}</strong> ({activePatient?.id}) • Blood: <strong style={{ color: 'var(--accent-cyan)' }}>{activePatient?.biodata?.bloodGroup || 'A+'}</strong> • Height: {activePatient?.biodata?.heightCm || 168}cm / {activePatient?.biodata?.weightKg || 75}kg
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleDownloadManifest}
            className="btn-primary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={15} />
            <span>Export Customs Manifest</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Interactive Config & Right Live Logistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1.75fr', gap: '1.5rem' }}>
        
        {/* Left Card: Country Selector & Surgical Element Configuration */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Globe size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                1. Operation Destination Country
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              Select where the patient will undergo the knee arthroplasty operation:
            </p>

            {/* Country Pill Selector Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              maxHeight: '220px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {COUNTRIES_CONFIG.map(c => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{c.flag}</span>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div>{c.name}</div>
                      <div style={{ fontSize: '0.68rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                        {c.transitTime}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Package size={18} color="#10b981" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                2. Specific Surgical Element to Dispatch
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              Choose the custom sterilized component to be manufactured & couriered:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SURGICAL_ELEMENTS.map(elem => {
                const isSelected = selectedElement.id === elem.id;
                const Icon = elem.icon;
                return (
                  <div
                    key={elem.id}
                    onClick={() => setSelectedElement(elem)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={16} color={isSelected ? '#10b981' : 'var(--accent-cyan)'} />
                        <span style={{ fontWeight: 600, fontSize: '0.82rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                          {elem.name}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={15} color="#10b981" />
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {elem.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Live Logistics Tracking, Consignment Manifest & Route */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {/* Tracking Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1rem',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                International Airway Tracking
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {trackingId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  style={{
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    color: 'var(--accent-cyan)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                  }}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Carrier & Service</span>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                {selectedCountry.carrier}
              </div>
            </div>
          </div>

          {/* Logistics Progression Timeline */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Consignment Progress to {selectedCountry.name} OR
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
              
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    3D MONAI Segmentation & CAD Cleanroom Sintering
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Patient morphometrics verified (Femur AP 56.4mm / Tibia ML 69.2mm). Titanium DMLS complete.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    Sterile Nitrogen Encapsulation & Cold-Chain Logger Active
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Temperature logging verified: <strong style={{ color: 'var(--accent-cyan)' }}>-80.2°C (Compliant)</strong>. Gamma SAL 10^-6 seal certified.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0, 242, 254, 0.2)',
                  border: '2px solid #00f2fe',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                  animation: 'pulse 2s infinite',
                }}>
                  ✈
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    In International Flight Transit to {selectedCountry.hubCity}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Clearance Reference: <strong style={{ color: '#fff' }}>{selectedCountry.regulatory}</strong>. Estimated arrival in {selectedCountry.transitTime}.
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  4
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Delivery to Destination Operating Room
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {selectedCountry.hospital} • Attending Surgical Team Check-in
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Technical Spec Snapshot Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            fontSize: '0.75rem',
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Element Material:</span>
              <strong style={{ color: '#fff' }}>{selectedElement.material}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Sterilization Method:</span>
              <strong style={{ color: '#10b981' }}>{selectedElement.sterility}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Hospital:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{selectedCountry.hospital}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Customs Clearance:</span>
              <strong style={{ color: '#f59e0b' }}>{selectedCountry.regulatory}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
