import AssessmentApp from '@/components/AssessmentApp';

export default function HomePage() {
  return (
    <>
      {/* Real SEO content — server rendered, fully visible to Google */}
      <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }} aria-hidden="true">
        <h1>Free ADHD Self-Assessment for Adults — ADHD Mirror</h1>
        <p>ADHD Mirror is a free, clinically-informed ADHD self-assessment tool for adults based on the ASRS v1.1 Part A screening methodology developed by the WHO and Harvard Medical School.</p>
        <h2>What makes this ADHD test different?</h2>
        <p>ADHD Mirror uses a two-tier scoring system that accounts for masking — the coping behaviours that cause many people with ADHD, particularly women, to score lower than their symptoms warrant.</p>
        <h2>Who is this ADHD test for?</h2>
        <p>This free ADHD assessment is designed for adults who suspect they might have ADHD, have never been formally assessed, or feel that previous assessments did not capture the full picture.</p>
        <h2>Getting an ADHD diagnosis in the UK</h2>
        <p>To get an ADHD diagnosis in the UK, speak to your GP first. ADHD Mirror generates a GP-ready summary to help you start that conversation.</p>
      </div>
      <AssessmentApp />
    </>
  );
}
