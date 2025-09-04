const Category = require('../models/Category')
const { getSeedCategories } = require('../data/teas')

async function readCategoriesFromDB() {
  try {
    const docs = await Category.find({}).lean().exec()
    return docs && Array.isArray(docs) ? docs : []
  } catch (err) {
    // DB not configured or unavailable
    return []
  }
}

exports.listCategories = async (_req, res) => {
  // If DB is not configured, immediately return seed data
  if (!process.env.MONGODB_URI) {
    return res.json({ categories: getSeedCategories() })
  }

  // Try DB first
  let categories = await readCategoriesFromDB()

  if (!categories.length) {
    // Fallback to seed
    const seed = getSeedCategories()

    // If DB is available, attempt to seed it (best-effort)
    try {
      await Category.insertMany(seed, { ordered: false })
      categories = await readCategoriesFromDB()
    } catch (_) {
      // Ignore insert errors in case of duplicates or no DB
      categories = seed
    }

    // If still empty after attempted insert, just return seed
    if (!categories.length) categories = seed
  }

  return res.json({ categories })
}
