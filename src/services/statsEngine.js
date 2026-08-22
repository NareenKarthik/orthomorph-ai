// Biostatistics & Population Analysis Engine for Knee Osteoarthritis Research

export function calculateSummaryStats(values) {
  if (!values || values.length === 0) {
    return { mean: 0, sd: 0, median: 0, min: 0, max: 0, q1: 0, q3: 0, count: 0 };
  }

  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = +(sum / n).toFixed(2);

  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const sd = +Math.sqrt(variance).toFixed(2);

  const median = n % 2 === 0 ? +((sorted[n / 2 - 1] + sorted[n / 2]) / 2).toFixed(2) : +sorted[Math.floor(n / 2)].toFixed(2);
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const min = sorted[0];
  const max = sorted[n - 1];

  return { mean, sd, median, min, max, q1, q3, count: n };
}

// Student's / Welch's Two-Sample T-Test Approximation & P-Value
export function calculateTwoSampleTTest(groupA, groupB) {
  const statsA = calculateSummaryStats(groupA);
  const statsB = calculateSummaryStats(groupB);

  if (statsA.count < 2 || statsB.count < 2) {
    return { tStat: 0, pValue: 1.0, isSignificant: false, cohensD: 0, diffMean: 0, ci95: [0, 0] };
  }

  const diffMean = +(statsA.mean - statsB.mean).toFixed(2);
  const seA = Math.pow(statsA.sd, 2) / statsA.count;
  const seB = Math.pow(statsB.sd, 2) / statsB.count;
  const standardError = Math.sqrt(seA + seB);

  const tStat = standardError > 0 ? +(diffMean / standardError).toFixed(3) : 0;
  
  // Degrees of freedom (Welch-Satterthwaite)
  const df = Math.pow(seA + seB, 2) / (Math.pow(seA, 2) / (statsA.count - 1) + Math.pow(seB, 2) / (statsB.count - 1));

  // Approx p-value from t-stat (normal tail approx for df > 30)
  const absT = Math.abs(tStat);
  let pValue;
  if (absT > 6) {
    pValue = 0.00001; // < 0.0001
  } else if (absT > 3.5) {
    pValue = 0.0005;
  } else if (absT > 2.6) {
    pValue = 0.009;
  } else if (absT > 1.96) {
    pValue = 0.049;
  } else {
    pValue = +(0.5 * Math.exp(-0.717 * absT - 0.416 * absT * absT)).toFixed(4);
  }

  // Pooled Standard Deviation & Cohen's d Effect Size
  const pooledSD = Math.sqrt(((statsA.count - 1) * Math.pow(statsA.sd, 2) + (statsB.count - 1) * Math.pow(statsB.sd, 2)) / (statsA.count + statsB.count - 2));
  const cohensD = pooledSD > 0 ? +(Math.abs(diffMean) / pooledSD).toFixed(2) : 0;

  // 95% Confidence Interval of Difference
  const marginError = 1.96 * standardError;
  const ci95 = [+(diffMean - marginError).toFixed(2), +(diffMean + marginError).toFixed(2)];

  return {
    tStat,
    pValue,
    isSignificant: pValue < 0.05,
    cohensD,
    diffMean,
    ci95,
    statsA,
    statsB,
    df: Math.round(df)
  };
}

// Linear Regression between Two Metrics (e.g., Meniscal Thickness vs Joint Space Width or Age)
export function calculateLinearRegression(xVals, yVals) {
  if (xVals.length !== yVals.length || xVals.length === 0) return { slope: 0, intercept: 0, r2: 0, r: 0 };

  const n = xVals.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

  for (let i = 0; i < n; i++) {
    sumX += xVals[i];
    sumY += yVals[i];
    sumXY += xVals[i] * yVals[i];
    sumXX += xVals[i] * xVals[i];
    sumYY += yVals[i] * yVals[i];
  }

  const slope = +((n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)).toFixed(3);
  const intercept = +((sumY - slope * sumX) / n).toFixed(3);

  // Pearson correlation r
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  const r = denominator > 0 ? +(numerator / denominator).toFixed(3) : 0;
  const r2 = +(r * r).toFixed(3);

  return { slope, intercept, r, r2 };
}
