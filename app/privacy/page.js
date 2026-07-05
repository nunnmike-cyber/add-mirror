import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for ADHD Mirror — what information is collected, how it is stored, and your choices.',
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

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '0 0 12px' }}>Overview</h2>
          <p>ADHD Mirror is designed to collect as little personal information as possible. There is no account system, and your assessment answers are never stored on our servers. This page explains exactly what information exists, where it lives, and who can see it.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Information stored in your browser</h2>
          <p>When you take the assessment, your answers, your context information (such as age range and gender), your region preference, and — if you complete them — your GAD-7 and PHQ-9 screening answers are saved using your browser's local storage. This information stays on your own device; it is not sent to or stored on ADHD Mirror's servers at any point.</p>
          <p>This also means it's genuinely private from us — but it also means it's tied to that specific browser. If you clear your browser data, use a private/incognito window, or switch to a different device, this information will be lost, including access to a paid report. We recommend downloading a PDF copy of your report once you've unlocked it if you'd like a permanent record.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Payment information</h2>
          <p>Payments are processed entirely by Stripe, a third-party payment processor. ADHD Mirror never sees or stores your card details. Stripe collects your email address in order to send you a payment receipt; ADHD Mirror does not separately store, access, or use this email address, and does not maintain its own database of customers or purchases outside Stripe's own systems. Stripe's handling of your payment data is governed by Stripe's own privacy policy.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Your downloadable summary</h2>
          <p>The clinician/GP summary and any PDF export are generated entirely within your own browser, from the answers already stored there. Nothing is uploaded to or stored by ADHD Mirror when you generate, print, or download this document.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Analytics</h2>
          <p>We use Google Analytics (GA4) to understand overall site usage — for example, how many people view or click the unlock button, or download their summary. This is aggregate, interaction-level data (such as "the unlock button was viewed") rather than the content of your answers, which Google Analytics never receives. Google Analytics uses cookies and similar technologies as part of this; you can find out more in <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent }}>Google's own privacy policy</a>.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Cookies</h2>
          <p>Beyond the analytics cookies described above, ADHD Mirror does not use advertising or tracking cookies, and does not sell or share your information with third parties for marketing purposes.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Deleting your information</h2>
          <p>Because your assessment answers live only in your browser, you can delete them at any time by clearing your browser's site data or local storage for adhdmirror.com — there is no account for us to delete on your behalf. Stripe retains payment records independently, in line with its own legal and financial record-keeping obligations; if you have questions about payment data specifically, contact us using the details below and we'll help where we can.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>International visitors</h2>
          <p>ADHD Mirror is operated from the UK. If you're accessing the site from outside the UK, the limited information described above (principally, payment processing via Stripe) may be processed in the UK or in other countries where our service providers operate.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Children</h2>
          <p>ADHD Mirror is designed for adults and is not directed at children. We do not knowingly collect information from children.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Changes to this policy</h2>
          <p>We may update this policy from time to time as the site changes. The date below reflects the most recent update.</p>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: COLORS.ink, margin: '32px 0 12px' }}>Contact</h2>
          <p>If you have any questions about this policy or how your information is handled, email us at <a href="mailto:privacy@adhdmirror.com" style={{ color: COLORS.accent }}>privacy@adhdmirror.com</a>.</p>

          <p style={{ marginTop: 32, color: COLORS.muted, fontSize: 14 }}>Last updated: July 2026</p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
