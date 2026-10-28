import DOMPurify from 'dompurify'

export function sanitizeBlogHtml(content) {
  return DOMPurify.sanitize(content || '', {
    ALLOWED_TAGS: [
      'a', 'blockquote', 'br', 'em', 'h2', 'h3', 'li', 'ol', 'p', 'strong',
      'u', 'ul',
    ],
    ALLOWED_ATTR: ['href', 'rel', 'target'],
    ALLOW_DATA_ATTR: false,
  })
}
