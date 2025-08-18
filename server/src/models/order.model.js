import { type } from "os";

const { Schema } = require("mongoose");

const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Order';

const orderSchema = new Schema({
    order_userId: { type: Schema.Types.ObjectId, ref: 'User' },
    order_customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        note: { type: String, default: '' }
    },
    order_checkout: {
        totalPrice: { type: Number, required: true },
        totalApplyDiscount: { type: Number, required: true },
        feeShip: { type: Number, required: true },
    },
    order_shipping: {
        province: { type: String, default: '' },
        district: { type: String, default: '' },
        ward: { type: String, default: '' },
        street: { type: String, default: '' },
    },
    order_payment: { type: Object, default: {} },
    order_products: [
        {
            discount: [{ type: Schema.Types.ObjectId, ref: 'Discount' }].default([]),
            item_briefs: [{
                productId: { type: Schema.Types.ObjectId, ref: 'spu', required: true },
                image_thumb: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            }]
        }
    ].required(true),
    order_trackingNumber: { type: String, required: true },//#000104082025
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending'
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Order = model(DOCUMENT_NAME, orderSchema);

export default Order