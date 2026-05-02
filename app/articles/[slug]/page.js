import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import SiteFooter from '@/components/SiteFooter';

const COLORS = {
  cream: "#F9F5EE", paper: "#F2EBD9", warm: "#E8DCC8", ink: "#1A1410",
  inkLight: "#3D2E22", accent: "#C4581A", accentLight: "#E8885A",
  accentPale: "#F5DDD0", muted: "#8A7A68", mutedLight: "#B5A48E",
};

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.id === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://adhdmirror.com/articles/${article.id}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `https://adhdmirror.com/articles/${article.id}`,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.id === slug);
  if (!article) notFound();

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '60px 24px 80px' }}>
        <Link href="/articles" style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, textDecoration: 'none', marginBottom: 40, display: 'inline-block' }}>
          ← All articles
        </Link>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, letterSpacing: '0.2em', color: COLORS.accent, textTransform: 'uppercase', marginBottom: 20, marginTop: 24 }}>
          {article.readTime}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 700, color: COLORS.ink, lineHeight: 1.1, margin: '0 0 16px' }}>
          {article.title}
        </h1>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 18, lineHeight: 1.7, color: COLORS.muted, marginBottom: 48, borderBottom: `2px solid ${COLORS.warm}`, paddingBottom: 32 }}>
          {article.subtitle}
        </p>
        <div>
          {article.content.map((block, i) => {
            if (block.type === 'intro') return (
              <p key={i} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 18, lineHeight: 1.85, color: COLORS.inkLight, marginBottom: 32, fontWeight: 600 }}>
                {block.text}
              </p>
            );
            if (block.type === 'heading') return (
              <h2 key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: COLORS.ink, margin: '40px 0 14px' }}>
                {block.text}
              </h2>
            );
            if (block.type === 'paragraph') return (
              <p key={i} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, lineHeight: 1.85, color: COLORS.inkLight, marginBottom: 22 }}>
                {block.text}
              </p>
            );
            if (block.type === 'pullquote') return (
              <div key={i} style={{ margin: '36px 0', padding: '24px 32px', borderLeft: `4px solid ${COLORS.accent}`, background: COLORS.accentPale, borderRadius: '0 8px 8px 0' }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontStyle: 'italic', lineHeight: 1.65, color: COLORS.inkLight, margin: 0 }}>
                  {block.text}
                </p>
              </div>
            );
            return null;
          })}
        </div>
        <div style={{ marginTop: 56, padding: '28px 32px', background: COLORS.paper, border: `2px solid ${COLORS.warm}`, borderRadius: 12 }}>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.ink, margin: '0 0 8px' }}>
            Ready to see where you land?
          </p>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.6, margin: '0 0 20px' }}>
            Our free assessment covers masking, emotional experience, functional impact, and more — in about 5 minutes.
          </p>
          <Link href="/" style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: 4, padding: '14px 28px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            See if this sounds like you →
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
