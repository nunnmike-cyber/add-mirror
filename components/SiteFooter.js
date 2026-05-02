'use client';
import { useState } from 'react';
import Link from 'next/link';

const COLORS = {
  cream: "#F9F5EE", warm: "#E8DCC8", ink: "#1A1410",
  accent: "#C4581A", muted: "#8A7A68", mutedLight: "#B5A48E",
};

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: `2px solid ${COLORS.warm}`, padding: '40px 24px', textAlign: 'center', marginTop: 40 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>
          ADHD <span style={{ color: COLORS.accent, fontStyle: 'italic' }}>Mirror</span>
        </div>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>A free, clinically-informed ADHD self-assessment for adults.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
          {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }].map(link => (
            <Link key={link.href} href={link.href} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, color: COLORS.muted, textDecoration: 'none', borderBottom: `1px solid ${COLORS.warm}`, paddingBottom: 1 }}>
              {link.label}
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 12, color: COLORS.mutedLight, lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
          ADHD Mirror is a self-reflection tool only. It does not provide medical advice, a clinical diagnosis, or any form of professional assessment. Always consult a qualified healthcare professional.
        </p>
      </div>
    </footer>
  );
}
