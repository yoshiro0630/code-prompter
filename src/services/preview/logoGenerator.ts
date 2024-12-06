export const generateLogoPlaceholder = () => {
  const svgContent = `
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="16" fill="url(#gradient)" />
      <path d="M40 80V40L60 60L80 40V80" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#47FFFF"/>
          <stop offset="100%" stop-color="#FF47FF"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  const encodedSvg = encodeURIComponent(svgContent.trim())
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    .replace(/%22/g, "'");

  return `data:image/svg+xml;utf8,${encodedSvg}`;
};