'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SECTIONS } from '@/lib/constants';
import { calculateClusterPercentages, calculateFullScore, calculateImpairment, calculateDifferential } from '@/lib/scoring';

const COLORS = {
  ink: '#1A1410', inkLight: '#3D2E22', accent: '#C4581A', accentLight: '#D4793A',
  accentPale: '#F5DDD0', teal: '#2A6B6B', tealLight: '#3A8080', tealPale: '#D0ECEC',
  paper: '#F9F5EE', warm: '#E8DCC8', muted: '#8A7A68', mutedLight: '#B0A090',
  amber: '#C47A00', amberPale: '#FFF3CC', pageBg: '#FAF7F2',
};

// ── Archetype logic ───────────────────────────────────────────────────────────
function getArchetype(clusterPct, likelihood) {
  const { inattentive = 0, hyperactive = 0, masking = 0, emotional = 0, executive = 0, hyperfocus = 0 } = clusterPct;
  const highMasking = masking >= 60;
  const highEmotional = emotional >= 60;
  const highExecutive = executive >= 60;
  const highHyperfocus = hyperfocus >= 60;
  const highInattentive = inattentive >= 60;
  const highHyperactive = hyperactive >= 60;

  if (highMasking && likelihood === 'High') return {
    name: 'The High-Functioning Masker',
    body: "You've spent years getting things done — just at a cost most people around you can't see. On the outside, you appear capable, organised, even high-achieving. On the inside, it takes two or three times the effort of everyone else, and the gap between how you look and how you feel is exhausting. You're the person who holds it together until you can't, and then wonders why you're so burned out when you seemed fine.",
  };
  if (highHyperfocus && highEmotional) return {
    name: 'The Creative Overthinker',
    body: "Your mind moves fast — too fast, sometimes. You make connections other people miss, feel things deeply, and when something captures your attention you can go further into it than almost anyone. The flip side is a brain that won't switch off, ideas that pile up faster than you can act on them, and a tendency to overcomplicate things that should be simple. You're not scattered — you're running too many tabs.",
  };
  if (highHyperactive && highInattentive) return {
    name: 'The Restless Achiever',
    body: "You operate at a different speed. You make fast decisions, get bored quickly, and thrive under pressure in ways other people find baffling. You've probably been told to slow down, think before you speak, or be more patient — advice that's easier to give than to follow when your brain is wired for urgency. At your best you're energising, decisive, and unstoppable.",
  };
  if (highEmotional && highExecutive) return {
    name: 'The Sensitive Strategist',
    body: "You feel everything — criticism lands hard, injustice makes you furious, and when something matters to you, it really matters. You've built elaborate internal systems to manage this: ways of appearing calm, strategies to avoid situations that might overwhelm you. You're not fragile. You're someone running a very sophisticated operation just to get through a normal day.",
  };
  if (highInattentive && !highHyperactive) return {
    name: 'The Inattentive Understater',
    body: "Your ADHD doesn't shout. It whispers — in the unfinished projects, the lost threads, the conversations you checked out of halfway through. You're probably not the person anyone would point to and say 'they have ADHD,' which is partly why it's taken this long to look into it. The inattentive presentation is consistently the most underdiagnosed, partly because the people who have it are often quietly struggling in ways that don't disturb anyone else.",
  };
  return {
    name: 'The Late-Identified Adult',
    body: "For most of your life, you've had a nagging sense that something worked differently in you — without ever having the language for it. You've probably developed impressive workarounds, been labelled as anxious or underachieving, and wondered why things that seem effortless for others feel like wading through treacle. Getting here — taking this seriously — took courage.",
  };
}

// ── Three word profile ────────────────────────────────────────────────────────
function getThreeWords(clusterPct) {
  const { inattentive = 0, hyperactive = 0, masking = 0, emotional = 0, executive = 0, hyperfocus = 0 } = clusterPct;
  const clusters = [
    { key: 'inattentive', val: inattentive, word: 'Scattered' },
    { key: 'emotional', val: emotional, word: 'Sensitive' },
    { key: 'masking', val: masking, word: 'Hidden' },
    { key: 'executive', val: executive, word: 'Stuck' },
    { key: 'hyperfocus', val: hyperfocus, word: 'Absorbed' },
    { key: 'hyperactive', val: hyperactive, word: 'Restless' },
  ];
  const top3 = [...clusters].sort((a, b) => b.val - a.val).slice(0, 3);
  return top3.map(c => c.word);
}

// ── Strengths data ────────────────────────────────────────────────────────────
const STRENGTHS = {
  inattentive: { from: 'Inattention', to: 'Novelty Intelligence', body: "The same wiring that makes routine tasks feel impossible makes you exceptionally good at thinking in new directions. You notice things others screen out, make unexpected connections, and tend to approach problems without the blinkered assumptions that come from following established patterns." },
  executive: { from: 'Executive Dysfunction', to: 'Pressure Performance', body: "When the stakes are real and the deadline is now, something shifts. The executive dysfunction that makes low-urgency tasks feel impossible often inverts under genuine pressure — producing a focused, decisive version of yourself that others find impressive. Many people with this profile do their best work in a crisis." },
  hyperactive: { from: 'Hyperactivity', to: 'Sustained Energy', body: "The restlessness that makes stillness uncomfortable is the same energy that lets you outlast most people when you're engaged in something meaningful. You tend to bring vitality to environments and often find that you perform well across long, demanding days that exhaust others." },
  impulsive: { from: 'Impulsivity', to: 'Decisive Courage', body: "You act. Where others deliberate, hedge, and wait for more information, you make the call. In environments that reward speed, adaptability, and decisiveness — entrepreneurship, emergency response, creative fields, leadership — this is genuinely valuable." },
  emotional: { from: 'Emotional Intensity', to: 'Relational Depth', body: "You feel things fully — which means when you're in someone's corner, you're really in their corner. People with high emotional intensity scores tend to be fiercely loyal, highly empathetic, and attuned to the emotional undercurrents in a room in ways that make them exceptional friends, partners, and advocates." },
  hyperfocus: { from: 'Hyperfocus', to: 'Mastery Potential', body: "When something catches you, you go all the way in. This is how expertise is built — not through even, sustained effort, but through periods of complete absorption that compress years of learning into months. Most fields reward deep expertise over broad competence, and hyperfocus, properly directed, is one of the most powerful cognitive assets there is." },
  masking: { from: 'Masking & Compensation', to: 'Social Intelligence', body: "The effort you've put into reading rooms, adapting your presentation, and managing how you come across has — whether you intended it or not — built real social sophistication. High maskers tend to be perceptive, adaptive, and skilled at navigating complex social environments." },
};

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    const token = searchParams.get('token');

    // Unlock and store token if coming from Stripe
    if (payment === 'success' && token) {
      localStorage.setItem('adhd_mirror_unlocked', token);
    }

    // Check unlock status
    const storedToken = localStorage.getItem('adhd_mirror_unlocked');
    if (!storedToken) {
      router.push('/');
      return;
    }

    // Restore answers and context
    const savedAnswers = localStorage.getItem('adhd_mirror_answers');
    const savedContext = localStorage.getItem('adhd_mirror_context');

    if (!savedAnswers || !savedContext) {
      router.push('/');
      return;
    }

    const answers = JSON.parse(savedAnswers);
    const context = JSON.parse(savedContext);
    const allQuestions = SECTIONS.filter(s => s.type === 'questions').flatMap(s => s.questions);
    const clusterPct = calculateClusterPercentages(answers, allQuestions);
    const scoring = calculateFullScore(answers);
    const impairment = calculateImpairment(answers);
    const differentialFlags = calculateDifferential(answers);

    setReportData({ answers, context, clusterPct, scoring, impairment, differentialFlags });
    setReady(true);
  }, [searchParams, router]);

  if (!ready || !reportData) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.muted }}>Preparing your report…</p>
      </div>
    );
  }

  const { context, clusterPct, scoring } = reportData;
  const { likelihood, adjustedScore, coreSignal, partA, maskingApplied, maskingBoost } = scoring;
  const archetype = getArchetype(clusterPct, likelihood);
  const threeWords = getThreeWords(clusterPct);
  const inattentivePct = clusterPct.inattentive || 0;
  const hyperactivePct = clusterPct.hyperactive || 0;
  const isInattentiveDominant = inattentivePct > hyperactivePct + 15;
  const isHyperactiveDominant = hyperactivePct > inattentivePct + 15;
  let typeLabel = 'Combined Type';
  if (isInattentiveDominant) typeLabel = 'Inattentive Type (ADD)';
  if (isHyperactiveDominant) typeLabel = 'Hyperactive-Impulsive Type';

  const likelihoodColor = likelihood === 'High' ? COLORS.accent : likelihood === 'Moderate' ? COLORS.amber : COLORS.teal;
  const likelihoodBg = likelihood === 'High' ? COLORS.accentPale : likelihood === 'Moderate' ? COLORS.amberPale : COLORS.tealPale;

  const clusters = [
    { key: 'inattentive', label: 'Inattention', pct: clusterPct.inattentive || 0, desc: 'Difficulty focusing, following through, and staying organised', weight: '40% of core signal', typical: 20 },
    { key: 'executive', label: 'Executive Dysfunction', pct: clusterPct.executive || 0, desc: 'Time blindness, procrastination paralysis, task initiation', weight: '20% of core signal', typical: 22 },
    { key: 'hyperactive', label: 'Hyperactivity', pct: clusterPct.hyperactive || 0, desc: "Restlessness, difficulty sitting still, feeling 'switched on'", weight: 'Combined 20%', typical: 18 },
    { key: 'impulsive', label: 'Impulsivity', pct: clusterPct.impulsive || 0, desc: 'Acting before thinking, interrupting, difficulty waiting', weight: 'Combined 20%', typical: 15 },
    { key: 'emotional', label: 'Emotional Intensity', pct: clusterPct.emotional || 0, desc: 'Strong emotional reactions, rejection sensitivity, justice sensitivity', weight: '10% of core signal', typical: 25 },
    { key: 'hyperfocus', label: 'Hyperfocus', pct: clusterPct.hyperfocus || 0, desc: 'Intense absorption in things you love — the flip side of inattention', weight: '10% of core signal', typical: 28 },
    { key: 'masking', label: 'Masking & Compensation', pct: clusterPct.masking || 0, desc: 'Effort spent hiding or compensating for symptoms', weight: 'Modifier only', typical: 20 },
  ];

  const strengthClusters = clusters.filter(c => c.pct >= 40 && STRENGTHS[c.key]);

  const s = (styles) => styles;

  return (
    <div style={{ background: COLORS.pageBg, minHeight: '100vh', fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: `2px solid ${COLORS.warm}` }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.accent, marginBottom: 24, display: 'block' }}>ADHD Mirror</span>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, display: 'block', marginBottom: 16 }}>Your Full Report</span>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: COLORS.ink, lineHeight: 1.2, marginBottom: 8 }}>Your Personal ADHD Report</h1>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, marginTop: 6 }}>Completed {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · For your personal use and reflection</p>
        </div>

        {/* Likelihood card */}
        <div style={{ background: likelihoodBg, border: `2px solid ${likelihoodColor}`, borderRadius: 12, padding: '32px 36px', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: likelihoodColor, margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ADHD Likelihood</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 700, color: likelihoodColor, margin: 0, lineHeight: 1 }}>{likelihood}</h2>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.inkLight, margin: '10px 0 0' }}>Suggested presentation: <strong>{typeLabel}</strong></p>
            </div>
            <div style={{ width: 90, height: 90, borderRadius: '50%', border: `4px solid ${likelihoodColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: likelihoodColor }}>{adjustedScore}%</span>
            </div>
          </div>
        </div>

        {/* Archetype */}
        <div style={{ background: COLORS.ink, borderRadius: 12, padding: '36px 40px', marginBottom: 36, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, borderRadius: '50%', background: COLORS.accent, opacity: 0.06, transform: 'translate(40px,-60px)' }} />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accentLight, marginBottom: 12, display: 'block' }}>Your ADHD Archetype</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#F9F5EE', marginBottom: 16, lineHeight: 1.2 }}>{archetype.name}</h2>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.8, color: '#D4C8B8', position: 'relative', zIndex: 1 }}>{archetype.body}</p>
        </div>

        {/* Three word profile */}
        <div style={{ background: COLORS.accentPale, border: `2px solid ${COLORS.accent}`, borderRadius: 12, padding: '36px 40px', marginBottom: 36, textAlign: 'center' }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, marginBottom: 20, display: 'block' }}>Your profile in three words</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {threeWords.map((word, i) => (
              <span key={word}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: COLORS.ink }}>{word}</span>
                {i < threeWords.length - 1 && <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: COLORS.accent, margin: '0 12px' }}>·</span>}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, marginTop: 16, fontStyle: 'italic' }}>Based on your strongest signals across seven clusters</p>
        </div>

        {/* Strengths */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Your strengths — the other side of the picture</h2>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: COLORS.muted, lineHeight: 1.7, maxWidth: 560, marginBottom: 24 }}>The same traits that make certain things harder also show up differently in other contexts. These aren't consolation prizes — they're genuine cognitive assets.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {strengthClusters.map(c => {
              const s = STRENGTHS[c.key];
              return (
                <div key={c.key} style={{ padding: '20px 24px', borderRadius: 10, background: COLORS.paper, border: `1px solid ${COLORS.warm}`, borderLeft: `4px solid ${COLORS.accent}` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.muted }}>{s.from}</span>
                    <span style={{ color: COLORS.accent, fontWeight: 700, margin: '0 4px' }}>→</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: COLORS.accent }}>{s.to}</span>
                  </div>
                  <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, lineHeight: 1.75, color: COLORS.inkLight }}>{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cluster breakdown */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Your symptom breakdown</h2>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: COLORS.muted, lineHeight: 1.7, maxWidth: 560, marginBottom: 24 }}>Your responses across seven clusters, with detailed interpretation for your score range.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {clusters.map(c => {
              const barColor = c.pct >= 65 ? COLORS.accent : c.pct >= 40 ? COLORS.amber : COLORS.teal;
              const bgColor = c.pct >= 65 ? COLORS.accentPale : c.pct >= 40 ? COLORS.amberPale : COLORS.tealPale;
              const band = c.pct >= 60 ? 'high' : c.pct >= 40 ? 'moderate' : c.pct >= 20 ? 'low' : 'minimal';
              const bandCopy = {
                inattentive: {
                  high: "Inattention appears as one of your most prominent patterns — likely affecting your ability to complete tasks, hold onto information, and stay organised across different areas of life.",
                  moderate: "There's an inattention signal here. You may notice occasional difficulty sustaining focus on less engaging tasks, or find that your mind wanders more than you'd like.",
                  low: "Inattention doesn't appear as a significant pattern. You likely find it relatively straightforward to follow through on tasks and stay organised.",
                  minimal: "Inattention is not a notable feature of your profile in this assessment.",
                },
                executive: {
                  high: "Executive dysfunction is showing up strongly — this is the cluster that tends to have the biggest day-to-day impact, affecting work, relationships, and self-esteem. The internal experience is often one of paralysis: knowing exactly what you need to do, and being completely unable to start.",
                  moderate: "There's a moderate signal here. You likely experience some difficulty with procrastination or time estimation, but it's not derailing your day-to-day functioning consistently.",
                  low: "Executive function doesn't show up as a significant difficulty. Task initiation and time awareness seem relatively manageable — or you've developed reliable systems that compensate well.",
                  minimal: "Executive dysfunction is not a notable feature of your profile in this assessment.",
                },
                hyperactive: {
                  high: "Your hyperactivity score is notably elevated. In adults this often looks less like physical bouncing and more like mental restlessness — racing thoughts, difficulty sitting through long meetings, or always needing something on in the background.",
                  moderate: "There's a mild restlessness signal. You may find long, passive situations uncomfortable — preferring to be doing something — but it's unlikely to be causing significant problems.",
                  low: "Hyperactivity isn't a notable feature. You're likely comfortable with stillness and don't tend to feel internally 'switched on' in a way that's hard to manage.",
                  minimal: "Hyperactivity is not a notable feature of your profile in this assessment.",
                },
                impulsive: {
                  high: "Impulsivity is one of your stronger signals. This can affect relationships (speaking before thinking), finances (unplanned spending), and work (rushing decisions). It can also be a strength — you're often quick, decisive, and good in a crisis.",
                  moderate: "There's a moderate impulsivity signal. You may occasionally jump to decisions or find sustained patience harder than you'd like — but it's not a consistent pattern causing significant friction.",
                  low: "Impulsivity doesn't appear as a meaningful pattern. You tend to think before acting and feel comfortable waiting.",
                  minimal: "Impulsivity is not a notable feature of your profile in this assessment.",
                },
                emotional: {
                  high: "Emotional Intensity is one of your most prominent clusters. Rejection Sensitive Dysphoria — the intense emotional pain triggered by perceived criticism — is common in ADHD and often goes unrecognised. If you've ever been told you're 'too sensitive', this may explain a lot.",
                  moderate: "There's a mild emotional intensity signal. You feel things more intensely than most people around you — which can be a gift and an exhaustion in equal measure.",
                  low: "Emotional intensity isn't showing up as a significant feature. You tend to experience emotions in a fairly regulated way and recover from setbacks without being derailed.",
                  minimal: "Emotional intensity is not a notable feature of your profile in this assessment.",
                },
                hyperfocus: {
                  high: "Hyperfocus is strongly present. The ability to go deep is a real strength — but the flip side is that disengaging can be difficult, and tasks that don't trigger hyperfocus may feel almost impossible by comparison.",
                  moderate: "There's a moderate hyperfocus signal. You likely recognise the experience of getting absorbed in something and losing track of time — but it's not dramatically inconsistent with your ability to focus elsewhere.",
                  low: "Hyperfocus doesn't feature strongly. You may engage deeply with things you enjoy, but it doesn't tend to take over in a way that's hard to interrupt.",
                  minimal: "Hyperfocus is not a notable feature of your profile in this assessment.",
                },
                masking: {
                  high: "Your masking score is very high, which is significant. It means the other scores in this report may actually understate what you experience — because you've become skilled at compensating. High masking is associated with burnout, anxiety, and exhaustion.",
                  moderate: "There's a moderate masking signal. It suggests you've developed some compensatory strategies — possibly without even realising it. Your other scores may slightly underrepresent the effort involved in your day-to-day functioning.",
                  low: "Masking doesn't appear to be a significant factor. Your responses suggest you're not expending a large amount of effort hiding difficulties — which means your other scores are likely a fairly accurate reflection of your experience.",
                  minimal: "Masking is not a notable feature of your profile in this assessment.",
                },
              };
              return (
                <div key={c.key} style={{ padding: '16px 20px', background: bgColor, borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{c.label}</span>
                      <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 11, color: COLORS.mutedLight }}>{c.weight}</span>
                    </div>
                    <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, fontWeight: 700, color: barColor }}>{c.pct}%</span>
                  </div>
                  <div style={{ position: 'relative', height: 6, background: COLORS.warm, borderRadius: 3, marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: barColor, borderRadius: 3 }} />
                    <div style={{ position: 'absolute', top: -3, left: `${c.typical}%`, transform: 'translateX(-50%)', width: 2, height: 12, background: COLORS.ink, opacity: 0.25, borderRadius: 1 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, margin: 0 }}>{c.desc}</p>
                    <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 11, color: COLORS.mutedLight, flexShrink: 0, marginLeft: 12 }}>Typical: ~{c.typical}%</span>
                  </div>
                  <div style={{ padding: '14px 16px', background: COLORS.paper, borderRadius: 6, borderLeft: `3px solid ${barColor}` }}>
                    <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, lineHeight: 1.7, color: COLORS.inkLight, margin: 0 }}>{bandCopy[c.key]?.[band]}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight, lineHeight: 1.6, marginTop: 16 }}>
            The marker on each bar shows where most adults without ADHD tend to score. Figures are derived from ASRS validation studies and general population screening data.
          </p>
        </div>

        {/* Anxiety & mood */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Anxiety & mood — how you're doing right now</h2>
          <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.warm}`, borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: COLORS.inkLight }}>ADHD rarely travels alone. Anxiety and depression are among the most common co-occurring experiences. The validated questionnaires below are used widely in NHS primary care — use them to build a complete picture to take to your GP.</p>
          </div>

          {/* GAD-7 */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>Anxiety (GAD-7)</h3>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, marginBottom: 16, fontStyle: 'italic' }}>Over the last two weeks, how often have you been bothered by the following? Score: Not at all (0) · Several days (1) · More than half the days (2) · Nearly every day (3)</p>
          <ol style={{ listStyle: 'none', padding: 0, counterReset: 'q', marginBottom: 20 }}>
            {['Feeling nervous, anxious, or on edge', 'Not being able to stop or control worrying', 'Worrying too much about different things', 'Trouble relaxing', 'Being so restless that it\'s hard to sit still', 'Becoming easily annoyed or irritable', 'Feeling afraid, as if something awful might happen'].map((q, i) => (
              <li key={i} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, padding: '10px 0 10px 36px', position: 'relative', borderBottom: `1px solid ${COLORS.warm}`, lineHeight: 1.6 }}>
                <span style={{ position: 'absolute', left: 0, top: 10, width: 24, height: 24, background: COLORS.warm, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontWeight: 700, color: COLORS.ink }}>{i + 1}</span>
                {q}
              </li>
            ))}
          </ol>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {[
              { label: 'Minimal anxiety', range: '0–4', bg: COLORS.tealPale, border: COLORS.teal, body: "Your anxiety score is in the minimal range. This doesn't mean you never feel anxious — but it's not showing up as a persistent pattern right now." },
              { label: 'Mild anxiety', range: '5–9', bg: COLORS.amberPale, border: COLORS.amber, body: "Worth mentioning to your GP, particularly in the context of ADHD — the two often overlap and can amplify each other." },
              { label: 'Moderate anxiety', range: '10–14', bg: '#FFF0E8', border: COLORS.accentLight, body: "This is significant and worth raising explicitly with your GP. Moderate anxiety at this level can affect sleep, concentration, relationships, and physical health." },
              { label: 'Severe anxiety', range: '15–21', bg: COLORS.accentPale, border: COLORS.accent, body: "Please raise this with your GP as a priority. Effective support is available. You can also contact the Samaritans any time on 116 123." },
            ].map(b => (
              <div key={b.label} style={{ padding: '12px 16px', borderRadius: 8, background: b.bg, borderLeft: `3px solid ${b.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{b.label}</span>
                  <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.muted }}>Score {b.range}</span>
                </div>
                <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, lineHeight: 1.6, color: COLORS.inkLight, margin: 0 }}>{b.body}</p>
              </div>
            ))}
          </div>

          {/* PHQ-9 */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>Depression & mood (PHQ-9)</h3>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, marginBottom: 16, fontStyle: 'italic' }}>Over the last two weeks, how often have you been bothered by the following? Score: Not at all (0) · Several days (1) · More than half the days (2) · Nearly every day (3)</p>
          <ol style={{ listStyle: 'none', padding: 0, counterReset: 'q', marginBottom: 20 }}>
            {['Little interest or pleasure in doing things', 'Feeling down, depressed, or hopeless', 'Trouble falling or staying asleep, or sleeping too much', 'Feeling tired or having little energy', 'Poor appetite or overeating', 'Feeling bad about yourself — or that you are a failure, or have let yourself or your family down', 'Trouble concentrating on things, such as reading or watching television', 'Moving or speaking so slowly that others have noticed — or being so fidgety or restless that you\'ve been moving around much more than usual', 'Thoughts that you would be better off dead, or thoughts of hurting yourself'].map((q, i) => (
              <li key={i} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, padding: '10px 0 10px 36px', position: 'relative', borderBottom: `1px solid ${COLORS.warm}`, lineHeight: 1.6 }}>
                <span style={{ position: 'absolute', left: 0, top: 10, width: 24, height: 24, background: COLORS.warm, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontWeight: 700, color: COLORS.ink }}>{i + 1}</span>
                {q}
              </li>
            ))}
          </ol>

          {/* Q9 crisis box */}
          <div style={{ background: COLORS.accentPale, border: `2px solid ${COLORS.accent}`, borderRadius: 10, padding: '20px 24px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: COLORS.accent, marginBottom: 8 }}>⚠️ If you answered anything other than "Not at all" to question 9</h3>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: COLORS.inkLight, marginBottom: 12 }}>We want to acknowledge that gently and without alarm — these thoughts are more common than people realise, and they're a sign that you need and deserve proper support. Please don't face this alone.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.accent }}>📞 Samaritans: 116 123</span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.accent }}>💬 Shout: text 85258</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Minimal symptoms', range: '0–4', bg: COLORS.tealPale, border: COLORS.teal, body: "Your score is in the minimal range. Low mood is a normal part of life — this suggests it's not a persistent or clinically significant pattern right now." },
              { label: 'Mild symptoms', range: '5–9', bg: COLORS.amberPale, border: COLORS.amber, body: "Worth mentioning to your GP, especially alongside ADHD — low mood, low motivation, and difficulty experiencing pleasure are common features of both." },
              { label: 'Moderate symptoms', range: '10–14', bg: '#FFF0E8', border: COLORS.accentLight, body: "Please raise this with your GP. This level of low mood can significantly affect daily functioning and quality of life, and effective support is available." },
              { label: 'Moderately severe – severe symptoms', range: '15–27', bg: COLORS.accentPale, border: COLORS.accent, body: "Please speak to your GP as soon as possible, or contact the Samaritans on 116 123 (free, 24/7). You can also text SHOUT to 85258. Effective treatment exists — you deserve proper support." },
            ].map(b => (
              <div key={b.label} style={{ padding: '12px 16px', borderRadius: 8, background: b.bg, borderLeft: `3px solid ${b.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 700, color: COLORS.ink }}>{b.label}</span>
                  <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.muted }}>Score {b.range}</span>
                </div>
                <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, lineHeight: 1.6, color: COLORS.inkLight, margin: 0 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GP Section */}
        <div style={{ padding: '28px 32px', background: COLORS.paper, border: `2px solid ${COLORS.warm}`, borderRadius: 12, marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🩺</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>What to say to your GP</h4>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.6, marginBottom: 20 }}>Asking for an ADHD assessment can feel daunting. Here are some phrases that may help.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Opening the conversation', text: '"I\'ve been struggling with focus, organisation, and emotional regulation for most of my life and I\'d like to explore whether ADHD might be a factor. I\'d like to discuss a referral for an assessment."' },
                  { label: 'If they push back', text: '"I understand it might not be ADHD, but I\'d like to rule it out properly. These difficulties are affecting my work and relationships and I\'d like to take it seriously."' },
                ].map(s => (
                  <div key={s.label} style={{ background: COLORS.pageBg, border: `1px solid ${COLORS.warm}`, borderRadius: 8, padding: '16px 18px' }}>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.accent, marginBottom: 8, display: 'block' }}>{s.label}</span>
                    <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, fontStyle: 'italic', color: COLORS.inkLight, lineHeight: 1.6, margin: 0 }}>{s.text}</p>
                  </div>
                ))}
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>What to bring</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['This report as a structured self-reflection document', 'Any old school reports mentioning difficulty concentrating, daydreaming, or underachievement', 'A short written list of 3–5 specific examples of how symptoms affect your daily life', 'Whether a parent or sibling has an ADHD diagnosis'].map(item => (
                  <li key={item} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, padding: '6px 0 6px 24px', position: 'relative', borderBottom: `1px solid ${COLORS.warm}`, lineHeight: 1.6 }}>
                    <span style={{ position: 'absolute', left: 0, color: COLORS.accent, fontWeight: 700 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Workplace */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Understanding your rights at work</h2>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: COLORS.muted, lineHeight: 1.7, maxWidth: 560, marginBottom: 20 }}>ADHD is a protected characteristic under the Equality Act 2010. Your employer has a legal duty to make reasonable adjustments — whether or not you have a formal diagnosis.</p>

          <div style={{ background: COLORS.tealPale, border: `1px solid ${COLORS.tealLight}`, borderRadius: 10, padding: '20px 24px', marginBottom: 20, display: 'flex', gap: 14 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>⚖️</span>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight, lineHeight: 1.7 }}><strong style={{ color: COLORS.teal }}>You don't need a diagnosis to ask for adjustments.</strong> You can approach your employer, HR, or line manager and describe the difficulties you're experiencing. This report can support that conversation.</p>
          </div>

          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.ink, marginBottom: 14 }}>Reasonable adjustments to consider</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '🕐', title: 'Flexible start and finish times', desc: 'If time management in the morning is a significant difficulty, adjusted hours can make a meaningful difference.' },
              { icon: '🎧', title: 'Quiet working space or noise-cancelling headphones', desc: 'To reduce sensory overload and distraction in open-plan environments.' },
              { icon: '📝', title: 'Written instructions and meeting notes', desc: 'Rather than relying on verbal-only communication — a small change with significant impact.' },
              { icon: '📋', title: 'Smaller milestones and regular check-ins', desc: 'Breaking large projects into stages with agreed review points, rather than single distant deadlines.' },
              { icon: '🔕', title: 'Adjusted notification expectations', desc: 'Agreement that you won\'t be expected to respond to messages instantly — protecting deep work time.' },
            ].map(a => (
              <div key={a.title} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: COLORS.paper, border: `1px solid ${COLORS.warm}`, borderRadius: 8 }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <div>
                  <strong style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: COLORS.ink, fontSize: 14, display: 'block', marginBottom: 2 }}>{a.title}</strong>
                  <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{a.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: COLORS.amberPale, border: `1px solid #E8C97A`, borderRadius: 10, padding: '20px 24px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: COLORS.amber, marginBottom: 10 }}>Access to Work</h3>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: COLORS.inkLight, marginBottom: 10 }}>A government grant scheme that can fund ADHD coaching, assistive technology, and support worker hours. You don't need a formal diagnosis to apply — you need to demonstrate that your condition affects your ability to work.</p>
            <a href="https://www.gov.uk/access-to-work" target="_blank" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: COLORS.teal }}>gov.uk/access-to-work →</a>
          </div>
        </div>

        {/* Download & disclaimer */}
        <div className="no-print" style={{ marginBottom: 32, padding: '24px 28px', background: COLORS.paper, border: `2px solid ${COLORS.warm}`, borderRadius: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} style={{ background: COLORS.teal, color: '#fff', border: 'none', borderRadius: 4, padding: '14px 28px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>⬇ Download as PDF</button>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, margin: 0 }}>Use your browser's "Save as PDF" option when the print dialog opens.</p>
        </div>

        <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.warm}`, borderRadius: 10, padding: '24px 28px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Important</h3>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.7, marginBottom: 8 }}>This report is a self-reflection tool, not a clinical assessment. It cannot diagnose ADHD or any other condition. The scores are based on your self-reported responses and are intended to help you understand your own patterns and prepare for a professional conversation — not to replace one.</p>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.7 }}>If you're experiencing significant distress, please speak to your GP or contact the Samaritans on <strong>116 123</strong> (free, 24/7).</p>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight, marginTop: 12 }}>
            Generated by ADHD Mirror · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · <a href="https://adhdmirror.com/privacy" style={{ color: COLORS.accent }}>Privacy Policy</a>
          </p>
        </div>

        <button className="no-print" onClick={() => router.push('/')} style={{ marginTop: 24, padding: '14px 28px', border: `2px solid ${COLORS.warm}`, borderRadius: 4, background: 'transparent', color: COLORS.muted, fontFamily: "'Lora', Georgia, serif", fontSize: 15, cursor: 'pointer' }}>
          ← Back to my free results
        </button>

      </div>
    </div>
  );
}
