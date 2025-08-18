const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Resources';
const DOCUMENT_NAME = 'Resource';

const resourceSchema = new Schema({
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Resource = model(DOCUMENT_NAME, resourceSchema);

export default Resource