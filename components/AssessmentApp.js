'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, SECTIONS, FREQUENCY_OPTIONS, GENDER_OPTIONS, AGE_OPTIONS } from '@/lib/constants';
import {
  calculateClusterPercentages, calculateFullScore,
  calculateImpairment, calculateDifferential
} from '@/lib/scoring';
import ResultsScreen from './ResultsScreen';
import SiteFooter from './SiteFooter';

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 3, background: COLORS.warm }}>
      <div style={{ height: '100%', width: `${pct}%`, background: COLORS.accent, transition: 'width 0.5s ease' }} />
    </div>
  );
}

// ── Report Preview (intro page) ───────────────────────────────────────────────
function ReportPreview({ onStart }) {
  const bars = [
    { label: 'Inattention', pct: 78, color: '#C4581A' },
    { label: 'Executive Dysfunction', pct: 72, color: '#C4581A' },
    { label: 'Hyperactivity', pct: 42, color: '#C47A00' },
    { label: 'Impulsivity', pct: 55, color: '#C47A00' },
    { label: 'Emotional Intensity', pct: 85, color: '#C4581A' },
    { label: 'Hyperfocus', pct: 70, color: '#C4581A' },
    { label: 'Masking & Compensation', pct: 88, color: '#2A6B6B' },
  ];
  return (
    <div style={{ marginTop: 64, marginBottom: 8 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 10 }}>What you will receive</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700, color: COLORS.ink, margin: '0 0 10px', lineHeight: 1.2 }}>
          A report built around <em style={{ fontStyle: 'italic', color: COLORS.accent }}>you</em>
        </h2>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: COLORS.muted, lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
          Not a single score. A full breakdown across seven symptom clusters, a personal written profile, and a GP-ready summary you can actually use.
        </p>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', background: COLORS.paper, border: `2px solid ${COLORS.warm}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 32px rgba(26,20,16,0.10)' }}>
        <div style={{ background: COLORS.ink, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 10, letterSpacing: '0.18em', color: COLORS.accentLight, textTransform: 'uppercase', marginBottom: 3 }}>Your Results</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, color: '#F9F5EE', fontWeight: 700 }}>ADHD Mirror Assessment</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 10, color: COLORS.mutedLight, marginBottom: 2 }}>ADHD Likelihood</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: COLORS.accentLight }}>High</div>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ background: COLORS.ink, borderRadius: 8, padding: '16px 20px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 4, left: 12, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 60, lineHeight: 1, color: COLORS.accent, opacity: 0.15, pointerEvents: 'none' }}>"</div>
            <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 10, letterSpacing: '0.15em', color: COLORS.accentLight, textTransform: 'uppercase', marginBottom: 8 }}>Your Personal Profile</div>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, lineHeight: 1.75, color: '#F9F5EE', margin: 0, position: 'relative', zIndex: 1 }}>
              What stands out most in your answers isn't just the symptoms themselves — it's how much energy you appear to spend managing them. Your profile leans heavily toward the inattentive presentation, where the struggle isn't so much about energy as it is about finding the mental traction to start, sustain, and finish things.
            </p>
          </div>
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Symptom breakdown across 7 clusters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {bars.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 148, fontFamily: "'Lora', Georgia, serif", fontSize: 11, color: COLORS.inkLight, flexShrink: 0, textAlign: 'right' }}>{b.label}</div>
                  <div style={{ flex: 1, height: 7, background: COLORS.warm, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: b.pct + '%', background: b.color, borderRadius: 4 }} />
                  </div>
                  <div style={{ width: 30, fontFamily: "'Lora', Georgia, serif", fontSize: 11, fontWeight: 700, color: b.color, flexShrink: 0 }}>{b.pct}%</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.warm}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>🩺</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 2 }}>GP-ready summary included</div>
              <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.muted }}>Download a clinical summary with scores, cluster breakdown and differential flags — ready to take to your doctor.</div>
            </div>
          </div>
        </div>
        <div style={{ background: COLORS.warm, padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 11, color: COLORS.muted, fontStyle: 'italic' }}>Example output — your results will reflect your own answers</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 10, color: COLORS.mutedLight, letterSpacing: '0.08em' }}>ADHD MIRROR</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 36, paddingBottom: 16 }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.muted, marginBottom: 20 }}>Ready to see your own results?</p>
        <button onClick={onStart}
          style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 4, padding: '18px 40px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}
          onMouseOver={(e) => e.currentTarget.style.background = COLORS.accentLight}
          onMouseOut={(e) => e.currentTarget.style.background = COLORS.accent}>
          See if this sounds like you →
        </button>
      </div>
    </div>
  );
}

// ── Intro Screen ──────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  const router = useRouter();
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 32 }}>
        Free Self-Assessment
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 700, color: COLORS.ink, lineHeight: 1.05, margin: '0 0 24px' }}>
        Do I have<br /><span style={{ color: COLORS.accent, fontStyle: 'italic' }}>ADHD?</span>
      </h1>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 19, lineHeight: 1.7, color: COLORS.inkLight, marginBottom: 32, maxWidth: 540 }}>
        This isn't just another checklist. A more honest, more complete assessment — one that asks about masking, emotional experience, and how ADHD presents differently across genders.
      </p>
      <div style={{ marginBottom: 12 }}>
        <button onClick={onStart}
          style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 4, padding: '18px 40px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background = COLORS.accentLight}
          onMouseOut={e => e.currentTarget.style.background = COLORS.accent}>
          See if this sounds like you →
        </button>
      </div>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.mutedLight, marginBottom: 48, marginTop: 0 }}>
        This won't diagnose you — but it will give you something real to work with.
      </p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: COLORS.tealPale, border: `1px solid ${COLORS.tealLight}`, borderRadius: 6, padding: '10px 16px', marginBottom: 28 }}>
        <span style={{ fontSize: 16 }}>🏛️</span>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.teal, margin: 0, fontWeight: 600 }}>
          Scoring based on ASRS v1.1 Part A methodology (WHO & Harvard Medical School), with additional research on masking and gender differences
        </p>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
        {[{ icon: '🔒', text: 'Completely private' }, { icon: '🧠', text: 'Clinically informed' }, { icon: '⏱', text: '~5 minutes' }].map((item) => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, background: COLORS.paper, border: `1px solid ${COLORS.warm}`, borderRadius: 8, padding: '8px 16px', fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.inkLight }}>
            <span>{item.icon}</span><span>{item.text}</span>
          </div>
        ))}
      </div>
      <ReportPreview onStart={onStart} />
      <div style={{ marginTop: 32, maxWidth: 480, background: COLORS.tealPale, border: `1px solid ${COLORS.tealLight}`, borderRadius: 8, padding: '14px 18px' }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.teal, margin: 0, lineHeight: 1.6 }}>
          <strong>Under 18?</strong> This tool was designed with adults in mind, but you're welcome to use it. If your results raise questions, please talk to a parent, carer, or another trusted adult.
        </p>
      </div>
      {/* Articles link */}
      <div style={{ marginTop: 48, borderTop: `1px solid ${COLORS.warm}`, paddingTop: 32 }}>
        <button onClick={() => router.push('/articles')}
          style={{ background: 'transparent', border: `1px solid ${COLORS.warm}`, borderRadius: 8, padding: '18px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📚</span>
          <div>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>Not ready to take the assessment yet?</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, margin: '3px 0 0', lineHeight: 1.5 }}>Read our articles on ADHD in adults, masking, anxiety, and more →</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Context Screen ────────────────────────────────────────────────────────────
function ContextQuestion({ label, options, value, onChange }) {
  return (
    <div>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.inkLight, marginBottom: 12, fontWeight: 600 }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)}
            style={{ padding: '9px 18px', border: `2px solid ${value === opt ? COLORS.accent : COLORS.warm}`, borderRadius: 40, background: value === opt ? COLORS.accentPale : 'transparent', color: value === opt ? COLORS.accent : COLORS.inkLight, fontFamily: "'Lora', Georgia, serif", fontSize: 14, cursor: 'pointer', transition: 'all 0.15s', fontWeight: value === opt ? 600 : 400 }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContextScreen({ onNext }) {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [diagnosed, setDiagnosed] = useState('');
  const canContinue = gender && age && diagnosed;
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 16 }}>Before We Begin</div>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: COLORS.ink, margin: '0 0 12px' }}>A little context</h2>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.muted, lineHeight: 1.6, marginBottom: 40 }}>ADHD looks different depending on who you are. These answers help us give you more accurate, personalised feedback.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <ContextQuestion label="How do you identify?" options={GENDER_OPTIONS} value={gender} onChange={setGender} />
        <ContextQuestion label="Your age range" options={AGE_OPTIONS} value={age} onChange={setAge} />
        <ContextQuestion label="Have you ever been diagnosed with ADHD?" options={['No, never', 'I suspect I might have it', 'Diagnosed as a child', 'Diagnosed as an adult']} value={diagnosed} onChange={setDiagnosed} />
      </div>
      <button onClick={() => canContinue && onNext({ gender, age, diagnosed })}
        style={{ marginTop: 48, background: canContinue ? COLORS.accent : COLORS.warm, color: canContinue ? '#fff' : COLORS.mutedLight, border: 'none', borderRadius: 4, padding: '16px 36px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, cursor: canContinue ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
        Continue →
      </button>
    </div>
  );
}

// ── Question Row ──────────────────────────────────────────────────────────────
function QuestionRow({ question, value, onChange, index }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '14px 16px', background: value !== undefined ? COLORS.accentPale : index % 2 === 0 ? COLORS.paper : 'transparent', borderRadius: 6, transition: 'background 0.15s', border: `1px solid ${value !== undefined ? COLORS.accentLight + '44' : 'transparent'}` }}>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: COLORS.inkLight, lineHeight: 1.5, flex: 1, margin: 0, paddingRight: 16 }}>{question.text}</p>
      <div style={{ display: 'flex', gap: 4 }}>
        {FREQUENCY_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          const isHovered = hovered === opt.value;
          return (
            <button key={opt.value} onClick={() => onChange(opt.value)}
              onMouseEnter={() => setHovered(opt.value)} onMouseLeave={() => setHovered(null)}
              title={opt.label}
              style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${selected ? COLORS.accent : isHovered ? COLORS.accentLight : COLORS.warm}`, background: selected ? COLORS.accent : isHovered ? COLORS.accentPale : 'transparent', cursor: 'pointer', transition: 'all 0.12s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Question Section ──────────────────────────────────────────────────────────
function QuestionSection({ section, answers, onChange, onNext, onBack, isLast }) {
  const allAnswered = section.questions.every((q) => answers[q.id] !== undefined);
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 12 }}>{section.label}</div>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 700, color: COLORS.ink, margin: '0 0 10px', lineHeight: 1.1 }}>{section.title}</h2>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: COLORS.muted, lineHeight: 1.6, marginBottom: 40, maxWidth: 520 }}>{section.subtitle}</p>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, justifyContent: 'flex-end' }}>
        {FREQUENCY_OPTIONS.map((f) => (
          <div key={f.value} style={{ flex: 1, textAlign: 'center', fontFamily: "'Lora', Georgia, serif", fontSize: 10, color: COLORS.mutedLight, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{f.label}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {section.questions.map((q, i) => (
          <QuestionRow key={q.id} question={q} value={answers[q.id]} onChange={(val) => onChange(q.id, val)} index={i} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>
        <button onClick={onBack} style={{ padding: '14px 28px', border: `2px solid ${COLORS.warm}`, borderRadius: 4, background: 'transparent', color: COLORS.muted, fontFamily: "'Lora', Georgia, serif", fontSize: 15, cursor: 'pointer' }}>← Back</button>
        <button onClick={() => allAnswered && onNext()}
          style={{ padding: '14px 32px', border: 'none', borderRadius: 4, background: allAnswered ? COLORS.accent : COLORS.warm, color: allAnswered ? '#fff' : COLORS.mutedLight, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, cursor: allAnswered ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flex: 1 }}>
          {isLast ? 'See My Results →' : 'Next →'}
        </button>
      </div>
      {!allAnswered && <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.mutedLight, marginTop: 12, textAlign: 'center' }}>Please answer all questions to continue</p>}
    </div>
  );
}

// ── Encourage Screen ──────────────────────────────────────────────────────────
function EncourageScreen({ stage, onNext }) {
  const isEarly = stage === 'early';
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: isEarly ? 48 : 44, marginBottom: 28 }}>{isEarly ? '🧠' : '🏁'}</div>
      {isEarly ? (
        <>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: COLORS.ink, margin: '0 0 20px' }}>Finding this hard to focus on?</h2>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, lineHeight: 1.8, color: COLORS.inkLight, maxWidth: 480, margin: '0 auto 16px' }}>That's actually worth noting. Difficulty sustaining attention on tasks — even ones you genuinely care about — is one of the core features of ADHD.</p>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.8, color: COLORS.muted, maxWidth: 460, margin: '0 auto 40px' }}>Keep going — the results are worth it.</p>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: COLORS.ink, margin: '0 0 20px' }}>Nearly there</h2>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, lineHeight: 1.8, color: COLORS.inkLight, maxWidth: 480, margin: '0 auto 16px' }}>One final section — and then your results are ready.</p>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.8, color: COLORS.muted, maxWidth: 460, margin: '0 auto 40px' }}>Everything you've answered so far is already being used to build your personal profile.</p>
        </>
      )}
      <button onClick={onNext}
        style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 4, padding: '16px 40px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, cursor: 'pointer' }}
        onMouseOver={(e) => e.currentTarget.style.background = COLORS.accentLight}
        onMouseOut={(e) => e.currentTarget.style.background = COLORS.accent}>
        {isEarly ? 'Keep going →' : 'Final section →'}
      </button>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function AssessmentApp() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [context, setContext] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [sectionIndex]);

  const questionSections = SECTIONS.filter((s) => s.type === 'questions');
  const currentSection = SECTIONS[sectionIndex];
  const handleAnswer = (qid, val) => setAnswers((prev) => ({ ...prev, [qid]: val }));

  const trackEvent = (name, params) => {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', name, params || {});
    }
  };

  const goNext = () => {
    const next = Math.min(sectionIndex + 1, SECTIONS.length - 1);
    const nextSection = SECTIONS[next];
    if (sectionIndex === 0) trackEvent('assessment_started');
    if (nextSection?.type === 'results') trackEvent('results_reached');
    if (nextSection?.type === 'questions') trackEvent('section_started', { section_id: nextSection.id });
    if (nextSection?.type === 'encourage') trackEvent('encouragement_shown', { stage: nextSection.stage });
    setSectionIndex(next);
  };

  const goBack = () => setSectionIndex((i) => Math.max(i - 1, 0));
  const showProgress = sectionIndex > 1 && sectionIndex < SECTIONS.length - 1;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; } button { outline: none; } button:focus-visible { outline: 2px solid ${COLORS.accent}; outline-offset: 2px; }`}</style>
      {showProgress && <ProgressBar current={sectionIndex - 1} total={questionSections.length} />}
      {currentSection.type === 'intro' && <IntroScreen onStart={goNext} />}
      {currentSection.type === 'context' && <ContextScreen onNext={(ctx) => { setContext(ctx); goNext(); }} />}
      {currentSection.type === 'encourage' && <EncourageScreen stage={currentSection.stage} onNext={goNext} />}
      {currentSection.type === 'questions' && (
        <QuestionSection section={currentSection} answers={answers} onChange={handleAnswer} onNext={goNext} onBack={goBack} isLast={sectionIndex === SECTIONS.length - 2} />
      )}
      {currentSection.type === 'results' && <ResultsScreen answers={answers} context={context} onRestart={() => { setAnswers({}); setContext({}); setSectionIndex(0); }} />}
      <SiteFooter />
    </div>
  );
}
