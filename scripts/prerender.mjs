import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const SITE = 'https://deepdey.dev'
const buildDate = new Date().toISOString()
const lastmod = buildDate.slice(0, 10)

const projects = JSON.parse(readFileSync(resolve(root, 'src/data/projects.json'), 'utf8'))
const record = JSON.parse(readFileSync(resolve(root, 'src/data/record.json'), 'utf8'))

const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const CASE_MAP = { MTECH: 'MTech', MSC: 'MSc', BSC: 'BSc', HONOURS: 'Honours' }
const titleCase = (t) => t.split(' ').map((w) => {
  const bare = w.replace(/[()]/g, '')
  if (CASE_MAP[bare]) return w.replace(bare, CASE_MAP[bare])
  if (w.length <= 3 && w === w.toUpperCase()) return w
  return w[0].toUpperCase() + w.slice(1).toLowerCase()
}).join(' ')

const projectName = (p) => p.links.some((l) => /github\.com|npmjs\.com|pypi\.org/.test(l.url)) ? p.slug : titleCase(p.title)

function projectItem(p, i) {
  const link = (re) => p.links.find((l) => re.test(l.url))?.url
  const github = link(/github\.com/)
  const store = link(/npmjs\.com|pypi\.org/)
  const live = link(/^(?!.*(github|npmjs|pypi)).*$/) || p.links[0]?.url
  const base = {
    '@type': 'ListItem',
    position: i + 1,
    item: github
      ? {
          '@type': 'SoftwareSourceCode',
          name: projectName(p),
          description: p.description,
          codeRepository: github,
          ...(store ? { url: store } : {}),
          image: SITE + p.image,
          creator: { '@id': SITE + '/#person' },
        }
      : {
          '@type': 'WebApplication',
          name: projectName(p),
          description: p.description,
          url: live,
          image: SITE + p.image,
          creator: { '@id': SITE + '/#person' },
        },
  }
  return base
}

const KNOWS = [
  'Full stack development', 'Java', 'Spring Boot', 'JavaScript', 'Node.js', 'Express',
  'MongoDB', 'MERN stack', 'React', 'Angular', 'Python', 'Flask', 'PostgreSQL', 'PHP',
  'CodeIgniter', 'Large language models', 'LLM engineering', 'LangChain', 'AI agents',
  'AI/ML', 'DevOps', 'Docker', 'Jenkins', 'AWS', 'Flutter', 'Web scraping', 'Selenium',
]

const person = {
  '@type': 'Person',
  '@id': SITE + '/#person',
  name: 'Deep Dey',
  givenName: 'Deep',
  familyName: 'Dey',
  url: SITE + '/',
  email: 'mailto:mail@deepdey.dev',
  image: SITE + '/images/deep-dey-portrait.webp',
  jobTitle: 'Senior Project Lead',
  description: 'Full stack developer and LLM engineer based in Kolkata, India.',
  address: { '@type': 'PostalAddress', addressLocality: 'Kolkata', addressRegion: 'West Bengal', addressCountry: 'IN' },
  homeLocation: { '@type': 'Place', name: 'Kolkata, India' },
  worksFor: { '@type': 'Organization', name: 'Websofttechs', alternateName: ['Websoft Techs', 'Websoft'] },
  alumniOf: [
    { '@type': 'Organization', name: 'Bloomscorp' },
    { '@type': 'CollegeOrUniversity', name: 'University of Kalyani', alternateName: 'Kalyani University' },
    { '@type': 'CollegeOrUniversity', name: 'Kanchrapara College' },
  ],
  hasOccupation: ['Full Stack Developer', 'LLM Engineer', 'Spring Boot Java Developer', 'Senior Project Lead'].map((name) => ({
    '@type': 'Occupation',
    name,
    occupationLocation: { '@type': 'City', name: 'Kolkata' },
  })),
  hasCredential: [
    ['Master of Technology in Computer Science', '2023'],
    ['Master of Science in Computer Science', '2021'],
    ['Bachelor of Science in Computer Science (Honours)', '2019'],
  ].map(([name, date]) => ({
    '@type': 'EducationalOccupationalCredential',
    name,
    credentialCategory: 'degree',
    dateCreated: date,
    recognizedBy: { '@type': 'CollegeOrUniversity', name: 'University of Kalyani' },
  })),
  knowsAbout: KNOWS,
  sameAs: [
    'https://github.com/Deep-Dey',
    'https://www.linkedin.com/in/deep-dey-20998/',
    'https://twitter.com/iam_deep_dey',
  ],
}

const graph = (route, pageName) => {
  const g = [
    {
      '@type': 'WebSite',
      '@id': SITE + '/#website',
      url: SITE + '/',
      name: 'Deep Dey',
      inLanguage: 'en',
      publisher: { '@id': SITE + '/#person' },
    },
    route === '/'
      ? {
          '@type': 'ProfilePage',
          '@id': SITE + '/#profile',
          url: SITE + '/',
          name: pageName,
          inLanguage: 'en',
          isPartOf: { '@id': SITE + '/#website' },
          mainEntity: { '@id': SITE + '/#person' },
          hasPart: { '@id': SITE + '/#projects' },
          dateModified: buildDate,
        }
      : {
          '@type': 'CollectionPage',
          '@id': SITE + '/work/#page',
          url: SITE + '/work/',
          name: pageName,
          inLanguage: 'en',
          isPartOf: { '@id': SITE + '/#website' },
          about: { '@id': SITE + '/#person' },
          mainEntity: { '@id': SITE + '/#projects' },
          dateModified: buildDate,
        },
    ...(route === '/'
      ? []
      : [{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
            { '@type': 'ListItem', position: 2, name: 'Work', item: SITE + '/work/' },
          ],
        }]),
    person,
    {
      '@type': 'ItemList',
      '@id': SITE + '/#projects',
      name: 'Projects by Deep Dey',
      inLanguage: 'en',
      numberOfItems: projects.length,
      itemListElement: projects.map(projectItem),
    },
  ]
  return { '@context': 'https://schema.org', '@graph': g }
}

const ROUTES = {
  '/': {
    file: resolve(dist, 'index.html'),
    title: 'Deep Dey | Full Stack Developer & LLM Engineer, Kolkata',
    description: 'Deep Dey is a full stack developer and LLM engineer in Kolkata, India, and Senior Project Lead at Websofttechs. Java, Spring Boot, MERN, Angular, Python and LangChain.',
    url: SITE + '/',
    ogType: 'profile',
    extra: [
      '<meta property="profile:first_name" content="Deep" />',
      '<meta property="profile:last_name" content="Dey" />',
    ],
  },
  '/work/': {
    file: resolve(dist, 'work/index.html'),
    title: 'All Work | Deep Dey, Full Stack Developer & LLM Engineer',
    description: 'Projects by Deep Dey: the West Bengal Handloom portal (Spring Boot, PostgreSQL), Qubit Nexus LLM data chat, Anuprerna e-commerce, and open source on npm and PyPI.',
    url: SITE + '/work/',
    ogType: 'website',
    extra: [],
  },
}

function headTags(route, cfg) {
  const ld = JSON.stringify(graph(route, cfg.title), null, 2)
  JSON.parse(ld) // self-check: every emitted block must parse
  return [
    `<meta name="description" content="${esc(cfg.description)}" />`,
    `<link rel="canonical" href="${cfg.url}" />`,
    `<meta property="og:type" content="${cfg.ogType}" />`,
    `<meta property="og:site_name" content="Deep Dey" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(cfg.title)}" />`,
    `<meta property="og:description" content="${esc(cfg.description)}" />`,
    `<meta property="og:url" content="${cfg.url}" />`,
    `<meta property="og:image" content="${SITE}/og-image.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:alt" content="Deep Dey, Full Stack Developer and LLM Engineer, Kolkata" />`,
    `<link rel="alternate" hreflang="en" href="${cfg.url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${cfg.url}" />`,
    `<link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="LLM-readable summary" />`,
    ...cfg.extra,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@iam_deep_dey" />`,
    `<meta name="twitter:creator" content="@iam_deep_dey" />`,
    `<meta name="twitter:title" content="${esc(cfg.title)}" />`,
    `<meta name="twitter:description" content="${esc(cfg.description)}" />`,
    `<meta name="twitter:image" content="${SITE}/og-image.jpg" />`,
    `<meta name="twitter:image:alt" content="Deep Dey, Full Stack Developer and LLM Engineer, Kolkata" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join('\n    ')
}

// ---------- render routes ----------
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('index.html is missing <!--app-html-->')
if (!template.includes('<!--head-tags-->')) throw new Error('index.html is missing <!--head-tags-->')

for (const [route, cfg] of Object.entries(ROUTES)) {
  const html = render(route)
  const out = template
    .replace('<!--app-html-->', html)
    .replace('<!--head-tags-->', headTags(route, cfg))
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(cfg.title)}</title>`)
  mkdirSync(dirname(cfg.file), { recursive: true })
  writeFileSync(cfg.file, out)
  console.log(`prerendered ${route} -> ${cfg.file}`)
}

// ---------- sitemap.xml ----------
const urlEntry = (loc, priority) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
    <lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority>
  </url>`
writeFileSync(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntry(SITE + '/', '1.0')}
${urlEntry(SITE + '/work/', '0.8')}
</urlset>
`)

// ---------- sitemap-images.xml ----------
const siteImages = [
  '/images/deep-dey-portrait.webp',
  '/images/deep-dey-side-profile.webp',
  '/images/deep-dey-tech-stack.webp',
  '/og-image.jpg',
]
const projectImages = projects.map((p) => p.image)
const imgUrl = (u) => `    <image:image><image:loc>${SITE}${u}</image:loc></image:image>`
writeFileSync(resolve(dist, 'sitemap-images.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${lastmod}</lastmod>
${[...siteImages, ...projectImages].map(imgUrl).join('\n')}
  </url>
  <url>
    <loc>${SITE}/work/</loc>
    <lastmod>${lastmod}</lastmod>
${projectImages.map(imgUrl).join('\n')}
  </url>
</urlset>
`)

// ---------- llms.txt ----------
const pickUrl = (p) =>
  p.links.find((l) => /npmjs\.com|pypi\.org/.test(l.url))?.url ??
  p.links[0]?.url
writeFileSync(resolve(dist, 'llms.txt'), `# Deep Dey

> Full stack developer and LLM engineer in Kolkata, India; Senior Project Lead at Websofttechs.

## About

Deep Dey is a full stack developer and LLM engineer based in Kolkata, India. He works as Senior Project Lead at Websofttechs, building products with Spring Boot, Angular, React, Express and Python, and shipping language-model features for teams and companies around the world. He holds an MTech in Computer Science from the University of Kalyani.

## Experience

${record.map((e) => `- ${e.years}: ${titleCase(e.title)} — ${e.text}`).join('\n')}

## Projects

${projects.map((p) => `- [${projectName(p)}](${pickUrl(p)}): ${p.description}`).join('\n')}

## Skills

${KNOWS.join(', ')}

## Contact

- Email: mail@deepdey.dev
- GitHub: https://github.com/Deep-Dey
- LinkedIn: https://www.linkedin.com/in/deep-dey-20998/
- X: https://twitter.com/iam_deep_dey
- Resume: https://drive.google.com/file/d/1TPk5doVfckY401QU9wQNklYObXTltPPx/view?usp=sharing
- Site: https://deepdey.dev
`)

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender done')
