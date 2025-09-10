const { Schema, model } = require("mongoose");
const { type } = require("os");

const COLLECTION_NAME = 'Spus';
const DOCUMENT_NAME = 'Spu';

const spuSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String, required: true, unique: true },
    product_description: { type: String, required: true },

    product_thumb: { type: String, required: true },
    product_images: [{ type: String, required: true }],
    product_cover: { type: String, required: true },
    product_basePrice: { type: Number, default: 0 },

    product_attribute: { type: Array, default: [] },
    product_category: { type: Schema.Types.ObjectId, ref: 'Category' },
    product_brewing: { type: Array, default: [] },
    product_taste: [
        { type: Schema.Types.ObjectId, ref: 'Taste' }
    ],
    product_effects: [
        { type: Schema.Types.ObjectId, ref: 'ProductEffect' }
    ],
    product_ratingQuantity: { type: Number, default: 0 },

    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },

    isDraft: { type: Boolean, default: false, index: true, select: false },
    isPublished: { type: Boolean, default: true, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME

})

const SPU = model(DOCUMENT_NAME, spuSchema);

export default SPU