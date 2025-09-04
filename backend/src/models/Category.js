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
