import wordmarkSvg from '/brand/logo-wordmark.svg?raw'

const logoColors = {
  light: 'text-brand-text-primary',
  dark: 'text-brand-text-dark',
}

export function Logo({ color = 'light', className = '' }) {
  const colorClass = logoColors[color] ?? logoColors.light

  return (
    <span
      role="img"
      aria-label="Gearnix"
      className={`inline-flex [&>svg]:h-auto [&>svg]:w-full ${colorClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: wordmarkSvg }}
    />
  )
}
