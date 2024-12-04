import { Schema, model } from 'mongoose';
import { Products } from '../interfaces/products';

const productsSchema: Schema = new Schema<Products>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 1, max: 100000 },
  priceAfterDiscount: { type: Number, min: 1, max: 100000 },
  ratingAverage: Number,
  ratingCount: Number,
  quantity: { type: Number, min: 0, default: 0 },
  sold: { type: Number, default: 0 },
  cover: String,
  images: [String],
  category: { type: Schema.Types.ObjectId, ref: 'categories' },
  subcategory: { type: Schema.Types.ObjectId, ref: 'subcategories' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

productsSchema.virtual('reviews', { ref: 'reviews', localField: '_id', foreignField: 'product' })

// const imageUrl = (document: Products) => {
//   if (document.cover) {
//     document.cover = `${process.env.BASE_URL}/products/${document.cover}`
//   }
//   if (document.images) {
//     document.images = document.images.map(image => `${process.env.BASE_URL}/products/${image}`)
//   }
// }

// productsSchema.post<Products>('init', (document: Products) => { imageUrl(document) });
// productsSchema.post<Products>('save', (document: Products) => { imageUrl(document) });

productsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path: 'category', select: 'name' })
  this.populate({ path: 'subcategory', select: 'name' })
  next();
})

export default model<Products>('products', productsSchema)