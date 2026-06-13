'use client';
import { useState } from 'react';
import { COLORS } from '@/lib/constants';

export default function PaywallScreen({ onUnlock }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: Date.now().toString() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    { icon: '🪞', label: 'Your ADHD Archetype', desc: 'A named profile that explains how your specific pattern shows up in daily life' },
    { icon: '✦', label: 'Your profile in three words', desc: 'A shareable, personal distillation of your top three signals' },
    { icon: '💪', label: 'Strengths reframe', desc: 'Every cluster reframed positively — the other side of the picture' },
    { icon: '📋', label: 'Full score band analysis', desc: 'Detailed written interpretation of every cluster score' },
    { icon: '😰', label: 'Anxiety & mood screening', desc: 'GAD-7 and PHQ-9 built in, with GP-ready framing' },
    { icon: '🩺', label: 'GP self-advocacy scripts', desc: 'Exact words to use — including what to say if they push back' },
    { icon: '⚖️', label: 'Workplace rights guide', desc: 'Reasonable adjustments, Access to Work, and how to frame it without disclosing' },
    { icon: '⬇️', label: 'Download as PDF', desc: 'Take it to appointments, share with a trusted person, or keep for reference' },
  ];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 80px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
          Unlock Your Full Report
        </span>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: COLORS.ink, margin: '0 0 16px', lineHeight: 1.2 }}>
          Your results are ready
        </h2>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, color: COLORS.muted, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          You've completed the assessment. Your full personalised report is waiting — unlock it for a one-time payment of <strong style={{ color: COLORS.ink }}>£3.99</strong>.
        </p>
      </div>

      {/* Feature list */}
      <div style={{ background: COLORS.paper, border: `2px solid ${COLORS.warm}`, borderRadius: 12, padding: '28px 32px', marginBottom: 32 }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: COLORS.ink, margin: '0 0 20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          What's included
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {features.map((f) => (
            <div key={f.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
              <div>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: '0 0 2px' }}>{f.label}</p>
                <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            background: loading ? COLORS.warm : COLORS.accent,
            color: loading ? COLORS.muted : '#fff',
            border: 'none', borderRadius: 4,
            padding: '18px 48px',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 19, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            display: 'block', width: '100%', maxWidth: 400, margin: '0 auto',
          }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.background = COLORS.accentLight; }}
          onMouseOut={e => { if (!loading) e.currentTarget.style.background = COLORS.accent; }}
        >
          {loading ? 'Redirecting to checkout…' : 'Unlock my full report — £3.99'}
        </button>

        {error && (
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: '#C0392B', marginTop: 12 }}>{error}</p>
        )}

        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.mutedLight, marginTop: 16, lineHeight: 1.6 }}>
          🔒 Secure payment via Stripe · One-time only · No subscription
        </p>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight, marginTop: 4 }}>
          Your assessment answers are preserved — you won't need to redo anything.
        </p>
      </div>

      {/* Trust signals */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${COLORS.warm}`, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { icon: '🔒', text: 'Stripe-secured payment' },
          { icon: '🧠', text: 'Clinically informed' },
          { icon: '🔒', text: 'No data sold or shared' },
        ].map(t => (
          <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted }}>
            <span>{t.icon}</span><span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
