import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Understanding ADHD — Articles',
  description: 'Honest, research-grounded articles to help you understand how ADHD actually presents in adults. Covering masking, late diagnosis, anxiety, assessments, and ADHD in women.',
  alternates: {
    canonical: 'https://adhdmirror.com/articles',
  },
};

const COLORS = {
  cream: "#F9F5EE", warm: "#E8DCC8", ink: "#1A1410", inkLight: "#3D2E22",
  accent: "#C4581A", muted: "#8A7A68", mutedLight: "#B5A48E",
};

export default function ArticlesPage() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 80px' }}>
        <Link href="/" style={{ background: 'none', border: 'none', fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, cursor: 'pointer', padding: 0, marginBottom: 40, display: 'inline-block', textDecoration: 'none' }}>
          ← Back to assessment
        </Link>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 16, marginTop: 24 }}>ADHD Explained</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: COLORS.ink, lineHeight: 1.1, margin: '0 0 16px' }}>
          Understanding ADHD
        </h1>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, lineHeight: 1.7, color: COLORS.muted, marginBottom: 48, maxWidth: 520 }}>
          Honest, research-grounded articles to help you understand how ADHD actually presents in adults.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ARTICLES.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} style={{ textDecoration: 'none', padding: '24px 4px', display: 'block', borderBottom: `1px solid ${COLORS.warm}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: COLORS.ink, margin: '0 0 6px', lineHeight: 1.2 }}>
                    {article.title}
                  </h2>
                  <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, margin: '0 0 10px', lineHeight: 1.5 }}>
                    {article.subtitle}
                  </p>
                  <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight }}>{article.readTime}</span>
                </div>
                <span style={{ color: COLORS.accent, fontSize: 20, flexShrink: 0, marginTop: 2 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
