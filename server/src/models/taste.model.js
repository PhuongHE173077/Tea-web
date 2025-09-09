const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Tastes';

const roleSchema = new Schema({
    taste_name: { type: String, required: true },
    taste_slug: { type: String, required: true },
    taste_description: { type: String, required: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Taste = model('Taste', roleSchema);

export default Taste