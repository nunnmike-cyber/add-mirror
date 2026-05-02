

export const metadata = {
  metadataBase: new URL('https://adhdmirror.com'),
  title: {
    default: 'Do I Have ADHD? — Free Adult Self-Assessment | ADHD Mirror',
    template: '%s | ADHD Mirror',
  },
  description: 'Free, clinically-informed ADHD self-assessment for adults. Based on ASRS Part A screening used by clinicians. Covers masking, emotional dysregulation, executive dysfunction and gives you a GP-ready summary. Takes 5 minutes.',
  keywords: ['do I have ADHD', 'ADHD test adults', 'ADHD self assessment', 'ADHD quiz UK', 'adult ADHD symptoms', 'ADHD screening tool', 'ADHD masking', 'inattentive ADHD', 'ADHD checklist adults', 'free ADHD test'],
  openGraph: {
    title: 'Do I Have ADHD? — Free Adult Self-Assessment',
    description: 'A clinically-informed ADHD screening tool that goes beyond standard checklists. Covers masking, emotional dysregulation, and gives you a GP-ready summary. Free, private, 5 minutes.',
    type: 'website',
    url: 'https://adhdmirror.com',
  },
  twitter: {
    card: 'summary',
    title: 'Do I Have ADHD? — Free Adult Self-Assessment',
    description: 'A clinically-informed ADHD screening tool that goes beyond standard checklists. Covers masking, emotional dysregulation, and gives you a GP-ready summary. Free, private, 5 minutes.',
  },
  alternates: {
    canonical: 'https://adhdmirror.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ADHD Mirror — Free Adult Self-Assessment",
              "url": "https://adhdmirror.com",
              "description": "A free, clinically-informed ADHD self-assessment for adults based on ASRS Part A screening methodology.",
              "applicationCategory": "HealthApplication",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
              "audience": { "@type": "Audience", "audienceType": "Adults wondering if they have ADHD" }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Can this test tell me if I have ADHD?", "acceptedAnswer": { "@type": "Answer", "text": "No self-assessment tool can diagnose ADHD — only a qualified clinician can do that. However, this assessment uses the ASRS Part A screening methodology validated by the WHO and Harvard Medical School." } },
                { "@type": "Question", "name": "What is ADHD masking?", "acceptedAnswer": { "@type": "Answer", "text": "Masking is when a person with ADHD learns to hide or compensate for their symptoms — appearing organised or calm on the outside while struggling significantly on the inside." } },
                { "@type": "Question", "name": "How is this different from other ADHD quizzes?", "acceptedAnswer": { "@type": "Answer", "text": "ADHD Mirror uses a two-tier scoring system based on the ASRS Part A screen, weighted by which symptom clusters are most predictive of ADHD in adults. It also separately assesses masking, emotional dysregulation, executive dysfunction, and functional impairment." } },
                { "@type": "Question", "name": "Is ADHD different in women?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Women and girls are significantly underdiagnosed with ADHD, often because they present with inattentive symptoms and are more likely to mask effectively." } },
                { "@type": "Question", "name": "What should I do if my results suggest I might have ADHD?", "acceptedAnswer": { "@type": "Answer", "text": "Start by speaking to your GP. You can download a GP-ready summary from this tool to bring to your appointment." } },
                { "@type": "Question", "name": "Can adults be diagnosed with ADHD for the first time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Many adults reach their 30s, 40s, or even later before receiving an ADHD diagnosis. Adult diagnosis is increasingly common and recognised by the NHS." } }
              ]
            })
          }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-98H66NRCH1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-98H66NRCH1');
            `
          }}
        />
      </head>
      <body style={{ margin: 0, fontFamily: "var(--font-lora), Georgia, serif" }}>
        {children}
      </body>
    </html>
  );
}
