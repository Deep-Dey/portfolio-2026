const socials = [
  ['GITHUB', 'https://github.com/Deep-Dey', 'me noopener'],
  ['LINKEDIN', 'https://www.linkedin.com/in/deep-dey-20998/', 'me noopener'],
  ['X', 'https://twitter.com/iam_deep_dey', 'me noopener'],
  ['RESUME', 'https://drive.google.com/file/d/1TPk5doVfckY401QU9wQNklYObXTltPPx/view?usp=sharing', 'noopener'],
]

export default function Footer() {
  return (
    <footer className="foot">
      <span className="brand">
        DEEP DEY©
        <img className="brand__logo" src="/assets/logo/deep-dey-logo-64.png" width="64" height="64" alt="Deep Dey logo" />
      </span>
      <a className="mail" href="mailto:mail@deepdey.dev">mail@deepdey.dev</a>
      <nav aria-label="Elsewhere">
        {socials.map(([label, href, rel]) => <a key={label} href={href} rel={rel}>{label}</a>)}
      </nav>
    </footer>
  )
}
