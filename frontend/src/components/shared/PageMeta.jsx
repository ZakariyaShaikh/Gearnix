import { useEffect } from 'react'

const DEFAULT_DESCRIPTION = 'Explore gaming essentials and stories from Gearnix.'

function setMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector(selector)

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    element.dataset.pageMeta = 'true'
    document.head.append(element)
  }
  element.content = content
}

export function PageMeta({ title, description = DEFAULT_DESCRIPTION, image, url }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Gearnix` : 'Gearnix'
    const summary = (description || DEFAULT_DESCRIPTION).slice(0, 160)
    const canonicalUrl = new URL(url || window.location.pathname, window.location.origin).href
    const canonical = document.head.querySelector('link[rel="canonical"]')
      || document.createElement('link')

    document.title = fullTitle
    setMeta('name', 'description', summary)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Gearnix')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', summary)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', image)

    canonical.rel = 'canonical'
    canonical.href = canonicalUrl
    document.head.append(canonical)
  }, [title, description, image, url])

  return null
}
