import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for ADHD Mirror.',
};

const COLORS = {
  cream: "#F9F5EE", warm: "#E8DCC8", ink: "#1A1410", inkLight: "#3D2E22",
  accent: "#C4581A", muted: "#8A7A68",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '60px 24px 80px' }}>
        <Link href="/" style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, textDecoration: 'none', marginBottom: 40, display: 'inline-block' }}>
          ← Back to assessment
        </Link>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 700, color: COLORS.ink, lineHeight: 1.1, margin: '24px 0 32px' }}>
          Terms of Service
        </h1>
        <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.8, color: COLORS.inkLight }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '0 0 12px' }}>Not a medical service</h2>
          <p>ADHD Mirror is a self-reflection tool only. It does not provide medical advice, a clinical diagnosis, or any form of professional assessment. Nothing on this site should be treated as a substitute for professional medical or psychological advice.</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Use of results</h2>
          <p>Your results are for personal reflection only. If your results raise concerns, please speak to a qualified healthcare professional. Do not use your results to self-diagnose or self-medicate.</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Accuracy</h2>
          <p>While ADHD Mirror is designed to be clinically informed and thoughtful, no self-report screening tool is perfectly accurate. False positives and false negatives both occur. Only a qualified clinician can diagnose ADHD.</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Age</h2>
          <p>This tool is designed for adults. If you are under 18, please discuss any concerns with a parent, carer, or trusted adult before taking any action.</p>
          <p style={{ marginTop: 32, color: COLORS.muted, fontSize: 14 }}>Last updated: 2025</p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
