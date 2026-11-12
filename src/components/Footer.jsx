const socials = [
  ['GITHUB', 'https://github.com/Deep-Dey'],
  ['LINKEDIN', 'https://www.linkedin.com/in/deep-dey-20998/'],
  ['X', 'https://twitter.com/iam_deep_dey'],
  ['RESUME', 'https://drive.google.com/file/d/1TPk5doVfckY401QU9wQNklYObXTltPPx/view?usp=sharing'],
]

export default function Footer() {
  return (
    <footer className="foot">
      <span className="brand">DEEP DEY©{new Date().getFullYear()}</span>
      <a className="mail" href="mailto:mail@deepdey.dev">mail@deepdey.dev</a>
      <nav aria-label="Elsewhere">
        {socials.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
    </footer>
  )
}
