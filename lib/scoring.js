import {
  CORE_SIGNAL_QUESTIONS, CORE_SIGNAL_WEIGHTS, MASKING_QUESTIONS,
  PART_A_QUESTIONS, PART_A_HIT_THRESHOLD, PART_A_POSITIVE_SCREEN,
  IMPAIRMENT_QUESTIONS, DIFFERENTIAL_ITEMS,
} from './constants';

export function calculateClusterPercentages(answers, allQuestions) {
  const clusters = {};
  allQuestions.forEach((q) => {
    if (!clusters[q.cluster]) clusters[q.cluster] = { total: 0, max: 0 };
    clusters[q.cluster].total += answers[q.id] ?? 0;
    clusters[q.cluster].max += 4;
  });
  const pct = {};
  Object.keys(clusters).forEach((k) => {
    pct[k] = clusters[k].max > 0 ? Math.round((clusters[k].total / clusters[k].max) * 100) : 0;
  });
  return pct;
}

export function calculateCoreSignal(answers) {
  const clusterScores = {};
  for (const [cluster, questionIds] of Object.entries(CORE_SIGNAL_QUESTIONS)) {
    let total = 0, max = 0;
    questionIds.forEach((qid) => { total += answers[qid] ?? 0; max += 4; });
    clusterScores[cluster] = max > 0 ? (total / max) * 100 : 0;
  }
  let coreSignal = 0;
  for (const [cluster, weight] of Object.entries(CORE_SIGNAL_WEIGHTS)) {
    coreSignal += (clusterScores[cluster] || 0) * weight;
  }
  return Math.round(coreSignal);
}

export function calculatePartAScreen(answers) {
  let hits = 0;
  PART_A_QUESTIONS.forEach((qid) => { if ((answers[qid] ?? 0) >= PART_A_HIT_THRESHOLD) hits += 1; });
  return { hits, total: PART_A_QUESTIONS.length, positive: hits >= PART_A_POSITIVE_SCREEN };
}

export function calculateMaskingModifier(answers) {
  let total = 0, max = 0;
  MASKING_QUESTIONS.forEach((qid) => { total += answers[qid] ?? 0; max += 4; });
  const maskingPct = max > 0 ? Math.round((total / max) * 100) : 0;
  let modifier = 0, level = "low";
  if (maskingPct >= 70) { modifier = 0.15; level = "high"; }
  else if (maskingPct >= 50) { modifier = 0.08; level = "moderate"; }
  return { maskingPct, modifier, level };
}

export function calculateChildhoodGate(answers) {
  const childIds = ["c1", "c2", "c3", "c4", "c5", "c6"];
  let total = 0, max = 0;
  childIds.forEach((qid) => { total += answers[qid] ?? 0; max += 4; });
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  return { pct, low: pct < 25 };
}

export function calculateFullScore(answers) {
  const coreSignal = calculateCoreSignal(answers);
  const partA = calculatePartAScreen(answers);
  const masking = calculateMaskingModifier(answers);
  const childhood = calculateChildhoodGate(answers);
  const adjustedScore = Math.round(coreSignal + (100 - coreSignal) * masking.modifier);
  let likelihood = "Low";
  if (partA.positive || adjustedScore >= 55) { likelihood = "High"; }
  else if (partA.hits >= 3 || adjustedScore >= 40) { likelihood = "Moderate"; }
  const childhoodCaveat = childhood.low && adjustedScore >= 50;
  return {
    coreSignal, adjustedScore, partA, masking, childhood, likelihood,
    childhoodCaveat, maskingApplied: masking.modifier > 0,
    maskingBoost: adjustedScore - coreSignal,
  };
}

export function calculateImpairment(answers) {
  let total = 0, max = 0;
  IMPAIRMENT_QUESTIONS.forEach((qid) => { total += answers[qid] ?? 0; max += 4; });
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  let level = "low";
  if (pct >= 65) level = "significant";
  else if (pct >= 40) level = "moderate";
  return { pct, level };
}

export function calculateDifferential(answers) {
  const flags = [];
  for (const [key, item] of Object.entries(DIFFERENTIAL_ITEMS)) {
    const score = answers[item.questions[0]] ?? 0;
    if (score >= 3) flags.push({ key, label: item.label, desc: item.desc, score });
  }
  return flags;
}
