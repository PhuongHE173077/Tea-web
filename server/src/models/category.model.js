const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Categories';
const DOCUMENT_NAME = 'Category';

const categorySchema = new Schema({
    category_name: { type: String, required: true },
    category_slug: { type: String, required: true, unique: true },
    category_description: { type: String, required: true },
    category_icon: { type: String, required: false },
    category_image: {
        url: { type: String, required: false },
        isActive: { type: Boolean, default: true }
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Category = model(DOCUMENT_NAME, categorySchema);

export default Category