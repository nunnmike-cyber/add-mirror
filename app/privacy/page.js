import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for ADHD Mirror — how we handle your data.',
};

const COLORS = {
  cream: "#F9F5EE", warm: "#E8DCC8", ink: "#1A1410", inkLight: "#3D2E22",
  accent: "#C4581A", muted: "#8A7A68",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '60px 24px 80px' }}>
        <Link href="/" style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, textDecoration: 'none', marginBottom: 40, display: 'inline-block' }}>
          ← Back to assessment
        </Link>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 700, color: COLORS.ink, lineHeight: 1.1, margin: '24px 0 32px' }}>
          Privacy Policy
        </h1>
        <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.8, color: COLORS.inkLight }}>
          <p>ADHD Mirror does not collect, store, or transmit any of your assessment answers. All scoring happens entirely in your browser — nothing is sent to any server.</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Analytics</h2>
          <p>We use Google Analytics to understand aggregate usage patterns (page views, session duration, geographic region). This data is anonymised and does not include your assessment responses.</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>GP Export</h2>
          <p>When you download the GP summary, this file is generated entirely in your browser and downloaded directly to your device. It is not transmitted to or stored by ADHD Mirror.</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Cookies</h2>
          <p>We use only the cookies required by Google Analytics. No advertising cookies or third-party tracking is used.</p>
          <p style={{ marginTop: 32, color: COLORS.muted, fontSize: 14 }}>Last updated: 2025</p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
