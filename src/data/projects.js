import data from './projects.json'

if (import.meta.env.DEV) {
  const seen = new Set()
  for (const p of data) {
    for (const key of ['slug', 'title', 'image', 'description']) {
      if (!p[key]) console.warn(`[projects] "${p.slug ?? '?'}" missing "${key}"`)
    }
    if (seen.has(p.slug)) console.warn(`[projects] duplicate slug "${p.slug}"`)
    seen.add(p.slug)
  }
}

export const projects = data
export const featured = data.filter((p) => p.featured)
export const spotlight = data.find((p) => p.spotlight)
export const openSourceCount = data.filter((p) => p.openSource).length
