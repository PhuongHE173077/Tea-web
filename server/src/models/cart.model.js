const { Schema } = require("mongoose");

const COLLECTION_NAME = 'Cards';
const DOCUMENT_NAME = 'Card';

const cardSchema = new Schema({
    card_userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    cart_products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'spu', required: true },
            image_thumb: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    cart_state: {
        type: String,
        enum: ['pending', 'active', 'completed', 'failed'],
        default: 'active'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Card = model(DOCUMENT_NAME, cardSchema);

export default Card