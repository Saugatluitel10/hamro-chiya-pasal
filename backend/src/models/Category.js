const mongoose = require('mongoose')

const TeaSchema = new mongoose.Schema(
  {
    titleNepali: { type: String, required: true },
    titleEnglish: { type: String, required: true },
    priceNpr: { type: Number, required: true },
    imageUrl: String,
    ingredients: [String],
    healthBenefits: [String],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    seasonal: Boolean,
    // Availability flag for menu display
    available: { type: Boolean, default: true },
    // Popularity score for sorting (e.g., sales count or manual weight)
    popularity: { type: Number, default: 0 },
  },
  { _id: false }
)

const CategorySchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true },
    titleNepali: { type: String, required: true },
    titleEnglish: { type: String, required: true },
    teas: { type: [TeaSchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Category', CategorySchema)
