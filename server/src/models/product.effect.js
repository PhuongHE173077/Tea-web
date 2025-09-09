const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'ProductEffects';

const roleSchema = new Schema({
    effect_name: { type: String, required: true },
    effect_slug: { type: String, required: true },
    effect_description: { type: String, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const ProductEffect = model('ProductEffect', roleSchema);

export default ProductEffect