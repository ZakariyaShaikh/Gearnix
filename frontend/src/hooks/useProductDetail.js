import { useEffect, useState } from 'react'
import { getPublicProductBySlug, listPublicProducts } from '@/api/catalog.api'

export function useProductDetail(slug) {
  const [response, setResponse] = useState({ slug: null, product: null, error: '' })
  const [relatedResponse, setRelatedResponse] = useState({ slug: null, items: [], error: '' })
  const loading = response.slug !== slug
  const relatedLoading = relatedResponse.slug !== slug

  useEffect(() => {
    let active = true

    getPublicProductBySlug(slug).then((product) => {
      if (active) setResponse({ slug, product, error: '' })
    }).catch((requestError) => {
      if (active) setResponse({ slug, product: null, error: requestError.message })
    })

    listPublicProducts({ page: 1, limit: 8 }).then((result) => {
      if (!active) return
      setRelatedResponse({
        slug,
        items: result.items.filter((item) => item.slug !== slug).slice(0, 4),
        error: '',
      })
    }).catch((requestError) => {
      if (active) setRelatedResponse({ slug, items: [], error: requestError.message })
    })

    return () => { active = false }
  }, [slug])

  return {
    loading,
    product: loading ? null : response.product,
    error: loading ? '' : response.error,
    relatedLoading,
    relatedProducts: relatedLoading ? [] : relatedResponse.items,
    relatedError: relatedLoading ? '' : relatedResponse.error,
  }
}
