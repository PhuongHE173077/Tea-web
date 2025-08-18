const { Schema } = require("mongoose");
const { type } = require("os");

const COLLECTION_NAME = 'Spus';
const DOCUMENT_NAME = 'Spu';

const spuSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String, required: true },
    product_description: { type: String, required: true },

    product_thumb: { type: String, required: true },
    product_images: [{ type: String, required: true }],

    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },

    product_attribute: { type: Schema.Types.Mixed, required: true },
    product_category: { type: Schema.Types.ObjectId, ref: 'Category' },

    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    product_validations: { type: Array, default: [] },

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME

})

const SPU = model(DOCUMENT_NAME, spuSchema);

export default SPU