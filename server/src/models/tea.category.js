import { model, Schema } from "mongoose";

const COLLECTION_NAME = 'TeaCategories';
const DOCUMENT_NAME = 'TeaCategory';

const teaCategorySchema = new Schema({
    tea_category_name: { type: String, required: true },
    tea_category_slug: { type: String, required: true, unique: true },
    tea_category_description: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const TeaCategory = model(DOCUMENT_NAME, teaCategorySchema);

export default TeaCategory