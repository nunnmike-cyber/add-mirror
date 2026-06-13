import { Suspense } from 'react';
import ReportPageInner from './ReportPageInner';

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, color: '#8A7A68' }}>Preparing your report…</p>
      </div>
    }>
      <ReportPageInner />
    </Suspense>
  );
}
