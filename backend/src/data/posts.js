// Seed blog posts used as a fallback until MongoDB is connected

/**
 * Post shape:
 * {
 *   slug: string,
 *   title: string,
 *   excerpt: string,
 *   content: string, // Markdown or plain HTML
 *   tags: string[],
 *   category: string,
 *   author: string,
 *   heroImage?: string,
 *   publishedAt: string (ISO),
 * }
 */

function getSeedPosts() {
  return [
    {
      slug: 'tea-brewing-basics',
      title: 'Tea Brewing Basics',
      excerpt: 'Learn essential steps to brew a perfect cup of Nepali tea at home.',
      content:
        '# Tea Brewing Basics\n\nBrewing tea is both an art and a daily ritual. This guide covers water temperature, steeping time, and ratios for a reliable cup.\n\n## Steps\n1. Boil fresh water.\n2. Add tea leaves and spices.\n3. Simmer and add milk/sugar to taste.\n\nEnjoy!\n',
      tags: ['guide', 'brewing'],
      category: 'guides',
      author: 'Team Hamro',
      heroImage:
        'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      slug: 'health-benefits-of-green-tea',
      title: 'Health Benefits of Green Tea',
      excerpt: 'From antioxidants to metabolism support, discover why green tea is beloved.',
      content:
        '# Health Benefits of Green Tea\n\nGreen tea is rich in polyphenols and catechins. Routine consumption may support metabolism and general wellbeing.\n',
      tags: ['health', 'green-tea'],
      category: 'health',
      author: 'Nutrition Desk',
      heroImage:
        'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1200&auto=format&fit=crop',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      slug: 'autumn-tea-recommendations',
      title: 'Autumn Tea Recommendations',
      excerpt: 'Cozy choices for chilly evenings: ginger, cardamom, and premium blends.',
      content:
        '# Autumn Tea Recommendations\n\nWhen the temperature drops, warm spices shine. Try Adrak (ginger) and Elaichi (cardamom) teas.\n',
      tags: ['seasonal', 'recommendations'],
      category: 'seasonal',
      author: 'Tea Curator',
      heroImage:
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop',
      publishedAt: new Date().toISOString(),
    },
  ]
}

module.exports = { getSeedPosts }
