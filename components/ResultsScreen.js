'use client';
import { useState, useEffect } from 'react';
import { COLORS, SECTIONS } from '@/lib/constants';
import {
  calculateClusterPercentages, calculateFullScore,
  calculateImpairment, calculateDifferential
} from '@/lib/scoring';

// ── Narrative generator ───────────────────────────────────────────────────────
function generateNarrative(clusterPct, context, scoring, answers) {
  const { inattentive = 0, hyperactive = 0, masking = 0, emotional = 0, executive = 0, hyperfocus = 0 } = clusterPct;
  const { likelihood, partA, maskingApplied, maskingBoost, childhoodCaveat } = scoring;
  const diffFlags = calculateDifferential(answers);
  const imp = calculateImpairment(answers);
  const isWoman = context.gender === 'Woman';
  const isNonBinary = context.gender === 'Non-binary / other';
  const highMasking = masking >= 60;
  const highEmotional = emotional >= 60;
  const highExecutive = executive >= 60;
  const highHyperfocus = hyperfocus >= 60;
  const highInattentive = inattentive >= 60;
  const highHyperactive = hyperactive >= 60;
  const neverDiagnosed = context.diagnosed === 'No, never';
  const suspectsDiagnosis = context.diagnosed === 'I suspect I might have it';
  const parts = [];

  if (likelihood === 'High') {
    if (highMasking && (isWoman || isNonBinary)) parts.push("What stands out most in your answers isn't just the symptoms themselves — it's how much energy you appear to spend managing them.");
    else if (highMasking) parts.push("Your results paint a picture of someone who has spent a long time finding ways to cope, often successfully enough that others may never have noticed the effort involved.");
    else if (highInattentive && !highHyperactive) parts.push("Your responses suggest a mind that works differently — one that struggles to find traction on things that don't capture it, while being capable of deep absorption when something does.");
    else parts.push("Across the areas we looked at, your answers align closely with how ADHD typically shows up in adults.");
  } else if (likelihood === 'Moderate') {
    parts.push("Your answers tell a mixed story — some areas show a strong pattern, while others are less pronounced — which is actually quite common, and doesn't mean your experiences aren't real.");
  } else {
    parts.push("While your results don't strongly point toward ADHD, that doesn't mean everything you're experiencing is simply 'normal' — and it's worth paying attention to the areas where you did score higher.");
  }

  if (partA.positive) parts.push(`On the seven questions most strongly linked to adult ADHD in clinical research, you scored at a significant level on ${partA.hits} of them — which meets the threshold for a positive screen on the WHO's adult ADHD scale.`);
  else if (partA.hits >= 3) parts.push(`You scored at a significant level on ${partA.hits} of the seven questions most strongly linked to adult ADHD — just below the clinical screening threshold, but enough to suggest these difficulties are real and worth taking seriously.`);

  if (highInattentive && highHyperactive) parts.push("You show signs of both the inattentive and hyperactive sides of ADHD — the internal restlessness and the difficulty holding focus can be an exhausting combination, even if it isn't always visible to others.");
  else if (highInattentive && !highHyperactive) parts.push("Your profile leans heavily toward the inattentive presentation — sometimes called ADD — where the struggle isn't so much about energy as it is about finding the mental traction to start, sustain, and finish things.");
  else if (highHyperactive && !highInattentive) parts.push("Your restlessness and impulsivity come through clearly — the kind of internal hum that's hard to explain to people who don't experience it.");

  if (maskingApplied && maskingBoost > 0) parts.push(`Your high masking score is significant — it suggests your raw symptom scores may understate the real picture. We've adjusted your overall score upward by ${maskingBoost} points to account for this.`);
  else if (highMasking && !maskingApplied) parts.push("Your masking score is notable — the effort you put into appearing on top of things is real, and it means the full weight of your symptoms may not be visible, even to yourself.");

  if (highEmotional && highExecutive) parts.push("Two things particularly stand out: the intensity with which you experience emotions, and the executive dysfunction — the paralysis, the time blindness — which is often one of the most impairing aspects of ADHD in adults.");
  else if (highEmotional) parts.push("The emotional intensity you described — the way criticism lands harder, the feeling that your reactions are bigger than the situation — is a genuine and often overlooked part of ADHD.");
  else if (highExecutive) parts.push("The executive dysfunction piece — the procrastination that feels like paralysis, the time blindness — came through clearly and is often one of the most impairing aspects of ADHD in adults.");

  if (childhoodCaveat) parts.push("One thing worth noting: your childhood scores were relatively low compared to your adult scores. This could mean several things — effective early masking, a supportive environment, or symptoms that emerged later — and it's something a professional assessment would explore further.");

  if (imp.level === 'significant' && likelihood === 'High') parts.push("Importantly, these aren't just abstract symptoms — you've described real impact on your work, relationships, or how you feel about yourself, which is exactly what clinicians look for alongside the symptom picture.");
  else if (imp.level === 'low' && likelihood === 'High') parts.push("Interestingly, while your symptom scores are high, your reported day-to-day impact is lower — which could mean your coping strategies are working hard behind the scenes.");

  if (diffFlags.length >= 2 && likelihood === 'High') parts.push("It's also worth knowing that you flagged in several areas that commonly co-exist with ADHD — including " + diffFlags.map(f => f.label.toLowerCase()).join(" and ") + ". This doesn't weaken your ADHD result; these conditions frequently travel together.");
  else if (diffFlags.length >= 2 && likelihood !== 'High') parts.push("You also flagged in areas beyond ADHD — including " + diffFlags.map(f => f.label.toLowerCase()).join(" and ") + " — which can produce symptoms that look a lot like ADHD.");
  else if (diffFlags.length === 1 && likelihood === 'Low') parts.push("Your " + diffFlags[0].label.toLowerCase() + " flag is worth paying attention to — it could be contributing to the focus and energy difficulties you're experiencing.");

  if ((isWoman || isNonBinary) && highInattentive && neverDiagnosed) parts.push(`As ${isWoman ? "a woman" : "someone"} who has never been diagnosed, it's worth knowing that inattentive ADHD is systematically underdiagnosed in people who aren't male — often because the symptoms are quieter, better masked, and easier to explain away.`);
  else if (highHyperfocus && likelihood !== 'Low') parts.push("The flip side of your attention difficulties also came through — that capacity for deep, absorbing focus when something captures you is real, and often the part of ADHD that people find hardest to believe sits alongside the struggles.");
  else if (suspectsDiagnosis && likelihood === 'High') parts.push("If you've suspected this for a while, your instincts appear to have been worth listening to — and these results give you something concrete to take to a professional.");
  else if (likelihood === 'Low') parts.push("It may be worth exploring whether anxiety, burnout, or disrupted sleep could be at the root of what you're experiencing — all of which can look remarkably similar to ADHD.");

  return parts.join(' ');
}

// ── Personal Narrative ────────────────────────────────────────────────────────
function PersonalNarrative({ clusterPct, context, scoring, answers }) {
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setNarrative(generateNarrative(clusterPct, context, scoring, answers));
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: COLORS.ink, borderRadius: 12, padding: '36px 40px', marginBottom: 36, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 16, left: 24, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 120, lineHeight: 1, color: COLORS.accent, opacity: 0.15, pointerEvents: 'none', userSelect: 'none' }}>"</div>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accentLight, textTransform: 'uppercase', margin: '0 0 16px' }}>Your Personal Profile</p>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${COLORS.accentLight}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: COLORS.mutedLight, margin: 0, fontStyle: 'italic' }}>Reading your results carefully…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 18, lineHeight: 1.8, color: '#F9F5EE', margin: 0, position: 'relative', zIndex: 1 }}>{narrative}</p>
      )}
    </div>
  );
}

// ── GP Export ─────────────────────────────────────────────────────────────────
function generateGPExport(clusterPct, scoring, context, typeLabel, impairment, differentialFlags) {
  const { coreSignal, adjustedScore, partA, masking, likelihood, maskingApplied, maskingBoost, childhoodCaveat } = scoring;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const clusterRows = [
    { label: 'Inattention', pct: clusterPct.inattentive || 0, typical: 20 },
    { label: 'Executive Dysfunction', pct: clusterPct.executive || 0, typical: 22 },
    { label: 'Hyperactivity', pct: clusterPct.hyperactive || 0, typical: 18 },
    { label: 'Impulsivity', pct: clusterPct.impulsive || 0, typical: 15 },
    { label: 'Emotional Intensity', pct: clusterPct.emotional || 0, typical: 25 },
    { label: 'Hyperfocus', pct: clusterPct.hyperfocus || 0, typical: 28 },
    { label: 'Masking & Compensation', pct: clusterPct.masking || 0, typical: 20 },
  ];
  const lc = likelihood === 'High' ? '#C4581A' : likelihood === 'Moderate' ? '#C47A00' : '#2A6B6B';
  const lbg = likelihood === 'High' ? '#F5DDD0' : likelihood === 'Moderate' ? '#FFF3CC' : '#D0ECEC';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ADHD Screening Results — GP Summary</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Lora', Georgia, serif; color: #1A1410; background: #fff; padding: 40px; max-width: 700px; margin: 0 auto; }
  h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; margin-bottom: 4px; }
  h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; margin: 28px 0 12px; border-bottom: 2px solid #E8DCC8; padding-bottom: 6px; }
  .subtitle { color: #8A7A68; font-size: 14px; margin-bottom: 24px; }
  .verdict { background: ${lbg}; border: 2px solid ${lc}; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
  .verdict-label { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: ${lc}; }
  .verdict-value { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 700; color: ${lc}; }
  .meta { display: flex; gap: 24px; flex-wrap: wrap; margin: 12px 0; }
  .meta-item { font-size: 13px; color: #3D2E22; }
  .meta-item strong { font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  th, td { text-align: left; padding: 8px 12px; font-size: 14px; }
  th { background: #F2EBD9; font-weight: 700; border-bottom: 2px solid #E8DCC8; }
  td { border-bottom: 1px solid #E8DCC8; }
  .high { color: #C4581A; font-weight: 700; }
  .moderate { color: #C47A00; font-weight: 700; }
  .low { color: #2A6B6B; }
  .note { background: #F9F5EE; border: 1px solid #E8DCC8; border-radius: 6px; padding: 14px 18px; margin: 12px 0; font-size: 13px; line-height: 1.6; color: #3D2E22; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E8DCC8; font-size: 12px; color: #8A7A68; line-height: 1.6; }
  @media print { body { padding: 20px; } .no-print { display: none; } }
</style></head><body>
<h1>ADHD Screening Results</h1>
<p class="subtitle">Self-assessment summary for GP review — ${today}</p>
<div class="verdict">
  <div class="verdict-label">Overall ADHD Likelihood</div>
  <div class="verdict-value">${likelihood}</div>
  <div class="meta">
    <div class="meta-item"><strong>Core signal:</strong> ${coreSignal}%</div>
    <div class="meta-item"><strong>Adjusted score:</strong> ${adjustedScore}%${maskingApplied ? ` (+${maskingBoost} masking adjustment)` : ''}</div>
    <div class="meta-item"><strong>Part A screen:</strong> ${partA.hits}/${partA.total} items at threshold (${partA.positive ? 'positive' : 'sub-threshold'})</div>
    <div class="meta-item"><strong>Suggested presentation:</strong> ${typeLabel}</div>
  </div>
</div>
<h2>Patient Context</h2>
<div class="meta">
  <div class="meta-item"><strong>Gender:</strong> ${context.gender || 'Not provided'}</div>
  <div class="meta-item"><strong>Age range:</strong> ${context.age || 'Not provided'}</div>
  <div class="meta-item"><strong>Prior diagnosis:</strong> ${context.diagnosed || 'Not provided'}</div>
</div>
<h2>Cluster Breakdown</h2>
<table>
  <tr><th>Cluster</th><th>Score</th><th>Typical adult range</th><th>Status</th></tr>
  ${clusterRows.map(r => `<tr><td>${r.label}</td><td><strong>${r.pct}%</strong></td><td>~${r.typical}%</td><td class="${r.pct >= 65 ? 'high' : r.pct >= 40 ? 'moderate' : 'low'}">${r.pct >= 65 ? 'Elevated' : r.pct >= 40 ? 'Borderline' : 'Typical range'}</td></tr>`).join('')}
</table>
${maskingApplied ? `<div class="note"><strong>Masking note:</strong> This patient scored ${clusterPct.masking || 0}% on compensation/masking items. The adjusted score includes a ${maskingBoost}-point upward modifier.</div>` : ''}
${childhoodCaveat ? `<div class="note"><strong>Childhood note:</strong> Childhood symptom scores were notably lower than adult scores. This warrants further clinical exploration.</div>` : ''}
${context.gender === 'Woman' && (clusterPct.inattentive || 0) > (clusterPct.hyperactive || 0) + 15 ? `<div class="note"><strong>Gender note:</strong> This patient presents with a predominantly inattentive profile. Research consistently shows inattentive ADHD is underdiagnosed in women.</div>` : ''}
<h2>Functional Impairment</h2>
<div class="meta"><div class="meta-item"><strong>Impact level:</strong> ${impairment.level === 'significant' ? 'Significant' : impairment.level === 'moderate' ? 'Moderate' : 'Low'} (${impairment.pct}%)</div></div>
<p style="font-size:13px;line-height:1.7;color:#3D2E22">${impairment.level === 'significant' ? 'Patient reports significant functional impairment across work, relationships, self-esteem, or daily responsibilities.' : impairment.level === 'moderate' ? 'Patient reports moderate functional impairment in some life areas.' : 'Patient reports relatively low functional impairment.'}</p>
${differentialFlags.length > 0 ? `<h2>Differential / Comorbidity Flags</h2>
<table><tr><th>Area</th><th>Signal</th><th>Clinical note</th></tr>
${differentialFlags.map(f => `<tr><td><strong>${f.label}</strong></td><td class="${f.score === 4 ? 'high' : 'moderate'}">${f.score === 4 ? 'Strong' : 'Flagged'}</td><td style="font-size:12px">${f.desc}</td></tr>`).join('')}
</table>
<div class="note"><strong>Context:</strong> ADHD commonly co-occurs with anxiety (~53%), depression (~58%), and sleep disorders (~37%) in adults.</div>` : ''}
<h2>Methodology</h2>
<p style="font-size:13px;line-height:1.7;color:#3D2E22">Two-tier scoring: weighted core signal (inattentive 40%, executive 20%, hyperactive-impulsive 20%, emotional 10%, hyperfocus 10%). Part A screen counts items scoring "Often" or "Always" on 7 ASRS-mapped questions; 4+ of 7 = positive screen. Masking applied as upward modifier.</p>
<div class="footer">
  <p><strong>Important:</strong> This is a self-report screening tool, not a clinical diagnosis. ASRS v1.1 Part A has demonstrated sensitivity of 68.7% and specificity of 99.5% for DSM-IV ADHD (Kessler et al. 2005).</p>
  <p style="margin-top:8px">Generated by ADHD Mirror — ${today}</p>
</div>
<div class="no-print" style="margin-top:24px;text-align:center">
  <button onclick="window.print()" style="background:#2A6B6B;color:#fff;border:none;border-radius:4px;padding:12px 32px;font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:600;cursor:pointer">Print this page</button>
</div>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ADHD-Screening-GP-Summary.html';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ScoringPill({ label, value, highlight }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: highlight ? COLORS.accentPale : COLORS.paper, border: `1px solid ${highlight ? COLORS.accentLight + '66' : COLORS.warm}`, borderRadius: 20, padding: '6px 14px' }}>
      <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.muted }}>{label}</span>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: highlight ? COLORS.accent : COLORS.ink }}>{value}</span>
    </div>
  );
}

function ClusterBar({ label, pct, desc, weight, typical }) {
  const barColor = pct >= 65 ? COLORS.accent : pct >= 40 ? '#C47A00' : COLORS.teal;
  const bgColor = pct >= 65 ? COLORS.accentPale : pct >= 40 ? '#FFF3CC' : COLORS.tealPale;
  return (
    <div style={{ padding: '16px 20px', background: bgColor, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{label}</span>
          <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 11, color: COLORS.mutedLight }}>{weight}</span>
        </div>
        <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, fontWeight: 700, color: barColor }}>{pct}%</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: COLORS.warm, borderRadius: 3, marginBottom: 8, overflow: 'visible' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 1s ease' }} />
        {typical != null && <div style={{ position: 'absolute', top: -3, left: `${typical}%`, transform: 'translateX(-50%)', width: 2, height: 12, background: COLORS.ink, opacity: 0.25, borderRadius: 1 }} />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, margin: 0 }}>{desc}</p>
        {typical != null && <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 11, color: COLORS.mutedLight, flexShrink: 0, marginLeft: 12 }}>Typical: ~{typical}%</span>}
      </div>
    </div>
  );
}

function NextStep({ icon, title, body }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '18px 20px', background: COLORS.paper, borderRadius: 8, border: `1px solid ${COLORS.warm}` }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: '0 0 4px' }}>{title}</p>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
export default function ResultsScreen({ answers, context, onRestart }) {
  const allQuestions = SECTIONS.filter((s) => s.type === 'questions').flatMap((s) => s.questions);
  const clusterPct = calculateClusterPercentages(answers, allQuestions);
  const scoring = calculateFullScore(answers);
  const { coreSignal, adjustedScore, partA, masking, likelihood, maskingApplied, maskingBoost, childhoodCaveat } = scoring;
  const impairment = calculateImpairment(answers);
  const differentialFlags = calculateDifferential(answers);
  const inattentivePct = clusterPct.inattentive || 0;
  const hyperactivePct = clusterPct.hyperactive || 0;
  const isInattentiveDominant = inattentivePct > hyperactivePct + 15;
  const isHyperactiveDominant = hyperactivePct > inattentivePct + 15;
  const isWoman = context.gender === 'Woman';
  const highMasking = (clusterPct.masking || 0) >= 60;
  let likelihoodColor = COLORS.teal, likelihoodBg = COLORS.tealPale;
  if (likelihood === 'High') { likelihoodColor = COLORS.accent; likelihoodBg = COLORS.accentPale; }
  else if (likelihood === 'Moderate') { likelihoodColor = '#C47A00'; likelihoodBg = '#FFF3CC'; }
  let typeLabel = 'Combined Type';
  if (isInattentiveDominant) typeLabel = 'Inattentive Type (ADD)';
  if (isHyperactiveDominant) typeLabel = 'Hyperactive-Impulsive Type';

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 16 }}>Your Results</div>

      {context.age === 'Under 18' && (
        <div style={{ background: '#F0F7FF', border: '2px solid #90CAF9', borderRadius: 12, padding: '24px 28px', marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>💙</span>
          <div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: '#1565C0', margin: '0 0 8px' }}>A note for you</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.7, margin: '0 0 10px' }}>This tool was built with adults in mind, but what you're feeling is completely real and worth paying attention to.</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.7, margin: 0 }}>Please talk to a parent, carer, or trusted adult. A GP appointment alongside a parent or carer is the right next step.</p>
          </div>
        </div>
      )}

      {/* Likelihood card */}
      <div style={{ background: likelihoodBg, border: `2px solid ${likelihoodColor}`, borderRadius: 12, padding: '32px 36px', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: likelihoodColor, margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ADHD Likelihood</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 700, color: likelihoodColor, margin: 0, lineHeight: 1 }}>{likelihood}</h2>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.inkLight, margin: '10px 0 6px' }}>Suggested presentation: <strong>{typeLabel}</strong></p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, margin: 0, lineHeight: 1.6, maxWidth: 420 }}>
              {isInattentiveDominant && likelihood === 'High' && "Your answers show a strong and consistent pattern across attention, organisation, and emotional regulation."}
              {isHyperactiveDominant && likelihood === 'High' && "Your answers show a strong and consistent pattern across restlessness, impulsivity, and difficulty with stillness."}
              {!isInattentiveDominant && !isHyperactiveDominant && likelihood === 'High' && "Your answers show a strong and consistent pattern across both attention and energy."}
              {likelihood === 'Moderate' && "Your answers show a meaningful pattern in several areas. This could reflect mild symptoms, effective coping, or a presentation worth exploring further."}
              {likelihood === 'Low' && "Your answers don't show a strong overall pattern consistent with ADHD — though some individual areas may still be worth reflecting on."}
            </p>
          </div>
          <div style={{ width: 90, height: 90, borderRadius: '50%', border: `4px solid ${likelihoodColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: likelihoodColor }}>{adjustedScore}%</span>
          </div>
        </div>
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${likelihoodColor}33` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <ScoringPill label="Core signal" value={`${coreSignal}%`} />
            <ScoringPill label="Part A screen" value={`${partA.hits}/${partA.total} items`} highlight={partA.positive} />
            {maskingApplied && <ScoringPill label="Masking adjustment" value={`+${maskingBoost} pts`} highlight />}
            <ScoringPill label="Functional impact" value={impairment.level === 'significant' ? 'Significant' : impairment.level === 'moderate' ? 'Moderate' : 'Low'} highlight={impairment.level === 'significant'} />
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
            <strong>How we score this:</strong> Your core signal is a weighted score across inattentive (40%), executive dysfunction (20%), hyperactive-impulsive (20%), emotional (10%), and hyperfocus (10%) clusters. The Part A screen counts how many of the 7 highest-signal questions you answered 'Often' or 'Always'. Masking adjusts your score upward when high.
          </p>
        </div>
      </div>

      <PersonalNarrative clusterPct={clusterPct} context={context} scoring={scoring} answers={answers} />

      {highMasking && (
        <div style={{ background: COLORS.tealPale, border: `1px solid ${COLORS.tealLight}`, borderRadius: 10, padding: '20px 24px', marginBottom: 28, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: COLORS.teal, margin: '0 0 6px' }}>High masking detected</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>
              Your answers suggest you may be working very hard to compensate for ADHD symptoms. This is especially common in {isWoman ? 'women and girls' : 'adults'} diagnosed later in life.
              {maskingApplied && ` We've added ${maskingBoost} points to your score to partially account for this.`}
            </p>
          </div>
        </div>
      )}

      {childhoodCaveat && (
        <div style={{ background: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: 10, padding: '20px 24px', marginBottom: 28, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>📝</span>
          <div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: '#8D6E00', margin: '0 0 6px' }}>A note about your childhood scores</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>Your childhood section scored lower than your adult sections. Many people masked effectively in childhood, or had supportive environments. A professional assessment would explore this in more detail.</p>
          </div>
        </div>
      )}

      {isWoman && isInattentiveDominant && (
        <div style={{ background: '#F5F0FF', border: '1px solid #C4A8FF', borderRadius: 10, padding: '20px 24px', marginBottom: 28, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>💜</span>
          <div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: '#6B3FA0', margin: '0 0 6px' }}>A note for women with inattentive ADHD</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>Research consistently shows that women are diagnosed with ADHD years later than men. If a professional has ever dismissed your concerns, it may be worth seeking a specialist experienced with adult ADHD in women.</p>
          </div>
        </div>
      )}

      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, margin: '40px 0 20px' }}>Your symptom breakdown</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
        {[
          { key: 'inattentive', label: 'Inattention', pct: clusterPct.inattentive || 0, desc: 'Difficulty focusing, following through, and staying organised', weight: '40% of core signal', typical: 20 },
          { key: 'executive', label: 'Executive Dysfunction', pct: clusterPct.executive || 0, desc: 'Time blindness, procrastination paralysis, task initiation', weight: '20% of core signal', typical: 22 },
          { key: 'hyperactive', label: 'Hyperactivity', pct: clusterPct.hyperactive || 0, desc: "Restlessness, difficulty sitting still, feeling 'switched on'", weight: 'Combined 20%', typical: 18 },
          { key: 'impulsive', label: 'Impulsivity', pct: clusterPct.impulsive || 0, desc: 'Acting before thinking, interrupting, difficulty waiting', weight: 'Combined 20%', typical: 15 },
          { key: 'emotional', label: 'Emotional Intensity', pct: clusterPct.emotional || 0, desc: 'Strong emotional reactions, rejection sensitivity, justice sensitivity', weight: '10% of core signal', typical: 25 },
          { key: 'hyperfocus', label: 'Hyperfocus', pct: clusterPct.hyperfocus || 0, desc: 'Intense absorption in things you love — the flip side of inattention', weight: '10% of core signal', typical: 28 },
          { key: 'masking', label: 'Masking & Compensation', pct: clusterPct.masking || 0, desc: 'Effort spent hiding or compensating for symptoms', weight: 'Modifier only', typical: 20 },
        ].map((item) => <ClusterBar key={item.key} {...item} />)}
      </div>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight, lineHeight: 1.6, marginBottom: 48, marginTop: -36 }}>
        The marker on each bar shows where most adults without ADHD tend to score. Figures are approximate, derived from ASRS validation studies and general population screening data.
      </p>

      {/* Impairment */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, margin: '0 0 12px' }}>How much is it affecting your life?</h3>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.6, marginBottom: 20, maxWidth: 560 }}>A clinical ADHD diagnosis requires not just symptoms, but evidence that those symptoms cause real difficulties across multiple areas of your life.</p>
        <div style={{ background: impairment.level === 'significant' ? COLORS.accentPale : impairment.level === 'moderate' ? '#FFF3CC' : COLORS.tealPale, border: `2px solid ${impairment.level === 'significant' ? COLORS.accent : impairment.level === 'moderate' ? '#C47A00' : COLORS.teal}`, borderRadius: 10, padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: impairment.level === 'significant' ? COLORS.accent : impairment.level === 'moderate' ? '#C47A00' : COLORS.teal }}>
              {impairment.level === 'significant' ? 'Significant impact' : impairment.level === 'moderate' ? 'Moderate impact' : 'Lower impact'}
            </span>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: impairment.level === 'significant' ? COLORS.accent : impairment.level === 'moderate' ? '#C47A00' : COLORS.teal }}>{impairment.pct}%</span>
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>
            {impairment.level === 'significant' && "Your answers suggest these difficulties are having a real and substantial effect on your work, relationships, self-esteem, or daily functioning."}
            {impairment.level === 'moderate' && "Your answers suggest these difficulties are affecting some areas of your life, though not across the board."}
            {impairment.level === 'low' && "Your answers suggest these difficulties aren't causing major disruption right now. This doesn't rule out ADHD — effective coping strategies can reduce visible impact."}
          </p>
        </div>
      </div>

      {/* Differential */}
      {differentialFlags.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, margin: '0 0 12px' }}>Other things worth exploring</h3>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.6, marginBottom: 20, maxWidth: 560 }}>
            {likelihood === 'High' || likelihood === 'Moderate' ? "Your ADHD scores are notable — but you also flagged in areas that overlap with or commonly co-occur alongside ADHD." : "Your ADHD scores were lower, but you flagged in some areas that can produce ADHD-like symptoms on their own."}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {differentialFlags.map((flag) => (
              <div key={flag.key} style={{ background: '#FFF8F0', border: '1px solid #F0D9B5', borderRadius: 10, padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5E6D0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 14 }}>{flag.key === 'anxiety' ? '😰' : flag.key === 'depression' ? '😔' : flag.key === 'sleep' ? '😴' : flag.key === 'burnout' ? '🔥' : '⚡'}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: '0 0 4px' }}>{flag.label} {flag.score === 4 ? '(strong signal)' : '(flagged)'}</p>
                  <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>{flag.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight, lineHeight: 1.6, marginTop: 14 }}>
            {likelihood === 'High' ? "These flags don't reduce your ADHD likelihood — ADHD very commonly co-occurs with anxiety (53%), depression (58%), and sleep difficulties (37%)." : "A professional can help untangle which of these are primary and which might be consequences of each other."}
          </p>
        </div>
      )}

      {/* Next steps */}
      <div style={{ borderTop: `2px solid ${COLORS.warm}`, paddingTop: 40 }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 20 }}>What should you do next?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {context.age === 'Under 18' ? (
            <NextStep icon="💙" title="Talk to a trusted adult" body="Find an adult you trust — a parent, carer, or someone in your life who makes you feel safe — and share what you've found here. You don't have to figure this out on your own." />
          ) : (
            <>
              {likelihood === 'High' && <NextStep icon="🩺" title="Speak to a professional" body="Your results suggest it's worth seeking a formal assessment. Ask your GP for a referral to a psychiatrist or clinical psychologist with ADHD experience. Bring these results with you." />}
              {likelihood === 'Moderate' && <NextStep icon="📋" title="Keep track of your experiences" body="Your results are in a borderline range. It may be worth journalling your symptoms for a few weeks and then speaking to your GP." />}
              {likelihood === 'Low' && <NextStep icon="🔍" title="Consider other explanations" body="Your results don't strongly suggest ADHD. However, anxiety, depression, sleep disorders, and burnout can all cause similar symptoms. If you're struggling, speak to your GP." />}
            </>
          )}
          <NextStep icon="📚" title="Learn more about how ADHD actually feels" body="Books like 'ADHD 2.0' (Hallowell & Ratey), 'Scattered Minds' (Gabor Maté), and 'Women with ADHD' (Sari Solden) describe the inner experience of ADHD in ways that can be genuinely illuminating." />
          <NextStep icon="💡" title="What this result actually means" body="A screening tool like this can help you recognise patterns and give you language for experiences you may have struggled to name for years. It can't diagnose ADHD — but it can tell you whether your experiences align with how ADHD tends to show up in adults." />
        </div>
      </div>

      {/* GP Export */}
      <div style={{ marginTop: 48, padding: '28px 32px', background: COLORS.paper, border: `2px solid ${COLORS.warm}`, borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🩺</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: COLORS.ink, margin: '0 0 8px' }}>Take this to your GP</h4>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.6, margin: '0 0 20px' }}>Download a clean summary of your results to print or share with a healthcare professional. It includes your scores, cluster breakdown, and relevant clinical context.</p>
            <button onClick={() => generateGPExport(clusterPct, scoring, context, typeLabel, impairment, differentialFlags)}
              style={{ background: COLORS.teal, color: '#fff', border: 'none', borderRadius: 4, padding: '14px 28px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = COLORS.tealLight}
              onMouseOut={(e) => e.currentTarget.style.background = COLORS.teal}>
              Download GP Summary
            </button>
          </div>
        </div>
      </div>

      <button onClick={onRestart} style={{ marginTop: 24, padding: '14px 28px', border: `2px solid ${COLORS.warm}`, borderRadius: 4, background: 'transparent', color: COLORS.muted, fontFamily: "'Lora', Georgia, serif", fontSize: 15, cursor: 'pointer' }}>
        ← Start over
      </button>
    </div>
  );
}
