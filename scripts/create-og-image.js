const sharp = require('sharp');

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fff2d6;stop-opacity:1" />
      <stop offset="55%" style="stop-color:transparent;stop-opacity:0" />
    </linearGradient>
    <linearGradient id="bg2" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#e6f5ff;stop-opacity:1" />
      <stop offset="60%" style="stop-color:transparent;stop-opacity:0" />
    </linearGradient>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fff7eb;stop-opacity:1" />
      <stop offset="55%" style="stop-color:#f6f1ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e8f3ff;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD166;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06D6A0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg3)"/>
  <circle cx="600" cy="-100" r="400" fill="url(#bg1)" opacity="0.8"/>
  <circle cx="600" cy="730" r="400" fill="url(#bg2)" opacity="0.8"/>
  
  <!-- Badge -->
  <rect x="450" y="60" width="300" height="50" rx="25" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
  <circle cx="480" cy="85" r="8" fill="#10b981"/>
  <text x="600" y="92" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#666" text-anchor="middle" letter-spacing="3">JOIN THE WAITLIST</text>
  
  <!-- Logo Circle -->
  <circle cx="600" cy="200" r="55" fill="#F5F5F5" stroke="#E5E5E5" stroke-width="2"/>
  <circle cx="600" cy="200" r="42" fill="url(#logoGrad)"/>
  
  <!-- Checkmark -->
  <path d="M 575 200 L 592 217 L 625 184" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Headline -->
  <text x="600" y="360" font-family="Georgia, serif" font-size="72" font-weight="600" fill="#1a1a1a" text-anchor="middle">Show up for your goals</text>
  
  <!-- Subheadline -->
  <text x="600" y="430" font-family="Georgia, serif" font-size="36" fill="#666" text-anchor="middle">Real accountability for real results</text>
  
  <!-- URL -->
  <text x="600" y="570" font-family="system-ui, sans-serif" font-size="24" fill="#999" text-anchor="middle" letter-spacing="2">showup.app</text>
</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile('./public/og-image.png')
  .then(() => console.log('✅ OG image created at public/og-image.png'))
  .catch(err => console.error('Error:', err));
