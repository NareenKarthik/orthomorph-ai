// Patient-Specific Knee Implant Sizing & Resection Analysis Engine

import { IMPLANT_CATALOG } from '../types/data';

/**
 * Find the closest matching femoral component for a given AP and ML dimension
 */
export function calculateFemoralSizing(patientFemurAP, patientFemurML, system = "Zimmer Persona") {
  const catalog = IMPLANT_CATALOG[system] || IMPLANT_CATALOG["Zimmer Persona"];
  
  let bestMatch = null;
  let minAPDiff = Infinity;

  catalog.forEach(item => {
    const apDiff = Math.abs(item.ap - patientFemurAP);
    if (apDiff < minAPDiff) {
      minAPDiff = apDiff;
      bestMatch = item;
    }
  });

  if (!bestMatch) return null;

  // Determine ML fit (Narrow, Standard, Plus)
  const standardML = bestMatch.mlStandard;
  const narrowML = bestMatch.mlNarrow || bestMatch.mlStandard - 2.5;
  const plusML = bestMatch.mlPlus || bestMatch.mlStandard + 2.5;

  let chosenType = "Standard";
  let chosenML = standardML;

  const diffNarrow = Math.abs(narrowML - patientFemurML);
  const diffStandard = Math.abs(standardML - patientFemurML);
  const diffPlus = Math.abs(plusML - patientFemurML);

  if (diffNarrow < diffStandard && diffNarrow < diffPlus && bestMatch.mlNarrow) {
    chosenType = "Narrow";
    chosenML = narrowML;
  } else if (diffPlus < diffStandard && diffPlus < diffNarrow && bestMatch.mlPlus) {
    chosenType = "Plus";
    chosenML = plusML;
  }

  // Overhang = Implant ML - Patient ML (negative is safe underhang, positive is overhang)
  const mlOverhang = +(chosenML - patientFemurML).toFixed(1);
  const apDifference = +(bestMatch.ap - patientFemurAP).toFixed(1);

  let fitSafety = "Optimal Fit";
  let alertVariant = "success";
  if (mlOverhang > 1.5) {
    fitSafety = "High Overhang Risk (>1.5mm) - May Impinge Collateral Ligaments";
    alertVariant = "danger";
  } else if (mlOverhang > 0.5) {
    fitSafety = "Mild ML Overhang (<1.5mm) - Acceptable";
    alertVariant = "warning";
  } else if (mlOverhang < -3.5) {
    fitSafety = "Excessive Underhang (<-3.5mm) - Risk of Incomplete Bone Coverage";
    alertVariant = "warning";
  }

  return {
    system,
    size: `${bestMatch.size} (${chosenType})`,
    rawSize: bestMatch.size,
    implantAP: bestMatch.ap,
    implantML: chosenML,
    patientAP: patientFemurAP,
    patientML: patientFemurML,
    apDiff: apDifference,
    mlOverhang,
    fitSafety,
    alertVariant,
    allOptions: catalog
  };
}

/**
 * Calculate Tibial Tray Fit & Polyethylene Thickness
 */
export function calculateTibialSizing(patientTibiaML, patientTibiaAP, medialMeniscusThickness, jswMedial) {
  // Approximate standard tibial tray sizes (ML: 62 to 84 mm, AP: 40 to 55 mm)
  const tibialCatalog = [
    { size: "Size 1", ml: 63.0, ap: 40.5 },
    { size: "Size 2", ml: 66.0, ap: 42.5 },
    { size: "Size 3", ml: 69.0, ap: 44.5 },
    { size: "Size 4", ml: 72.0, ap: 47.0 },
    { size: "Size 5", ml: 75.0, ap: 49.5 },
    { size: "Size 6", ml: 78.0, ap: 51.5 },
    { size: "Size 7", ml: 81.0, ap: 53.5 },
    { size: "Size 8", ml: 84.0, ap: 56.0 }
  ];

  let bestTray = tibialCatalog[0];
  let minDiff = Infinity;

  tibialCatalog.forEach(tray => {
    // Priority on ML matching to prevent overhang
    const diff = Math.abs(tray.ml - patientTibiaML);
    if (diff < minDiff) {
      minDiff = diff;
      bestTray = tray;
    }
  });

  const mlDiff = +(bestTray.ml - patientTibiaML).toFixed(1);
  const apDiff = +(bestTray.ap - patientTibiaAP).toFixed(1);

  // Cortical coverage estimate
  const patientArea = (patientTibiaML * patientTibiaAP * 0.785);
  const trayArea = (bestTray.ml * bestTray.ap * 0.785);
  const coveragePercent = +(Math.min(99.0, Math.max(85.0, (trayArea / patientArea) * 96.0))).toFixed(1);

  // Recommended Polyethylene insert based on meniscal loss (healthy is ~5.2mm)
  // Deficit in mm:
  const meniscusDeficit = Math.max(0, 5.2 - medialMeniscusThickness);
  let recommendedPoly = 10;
  if (meniscusDeficit > 3.8 || jswMedial < 1.0) {
    recommendedPoly = 14;
  } else if (meniscusDeficit > 2.5 || jswMedial < 2.0) {
    recommendedPoly = 12;
  } else if (meniscusDeficit > 1.2 || jswMedial < 3.5) {
    recommendedPoly = 10;
  } else {
    recommendedPoly = 9;
  }

  return {
    traySize: bestTray.size,
    implantML: bestTray.ml,
    implantAP: bestTray.ap,
    patientML: patientTibiaML,
    patientAP: patientTibiaAP,
    mlDiff,
    apDiff,
    coveragePercent: `${coveragePercent}%`,
    recommendedPoly: `${recommendedPoly} mm`,
    polyOptions: [
      { thickness: "9 mm", indication: "Minimal wear / tight joint space" },
      { thickness: "10 mm", indication: "Standard baseline gap restoration" },
      { thickness: "12 mm", indication: "Moderate meniscal wear & medial laxity" },
      { thickness: "14 mm", indication: "Severe bone loss / large flexion gap" },
      { thickness: "17 mm", indication: "Extreme bone loss / revision status" }
    ]
  };
}
