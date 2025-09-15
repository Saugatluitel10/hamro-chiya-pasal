const { getSeedPosts } = require('../data/posts')

function useDB() {
  return Boolean(process.env.MONGODB_URI)
}

// For now we only use seed posts; DB integration can be added later.
function getAllPosts() {
  const posts = getSeedPosts()
  return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

exports.listPosts = async (_req, res) => {
  // If DB exists, you would query it here; for now seed-only
  const posts = getAllPosts()
  res.json({ posts })
}

exports.getPost = async (req, res) => {
  const { slug } = req.params
  const posts = getAllPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) {
    res.status(404)
    return res.json({ message: 'Post not found' })
  }
  res.json({ post })
}

exports.relatedPosts = async (req, res) => {
  const { slug } = req.params
  const posts = getAllPosts()
  const current = posts.find((p) => p.slug === slug)
  if (!current) {
    res.status(404)
    return res.json({ message: 'Post not found' })
  }
  const related = posts
    .filter((p) => p.slug !== current.slug)
    .filter((p) => p.category === current.category || p.tags.some((t) => current.tags.includes(t)))
    .slice(0, 3)
  res.json({ related })
}

exports.rss = async (_req, res) => {
  const site = process.env.FRONTEND_URL || 'https://frontend-juu3h5fhp-saugats-projects-64133a90.vercel.app'
  const posts = getAllPosts()
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/en/blog/${p.slug}</link>
      <guid>${site}/en/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Hamro Chiya Pasal Blog</title>
      <link>${site}/en/blog</link>
      <description>Guides, culture, health benefits, and updates from Hamro Chiya Pasal</description>
      ${items}
    </channel>
  </rss>`

  res.type('application/rss+xml').send(xml)
}

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
