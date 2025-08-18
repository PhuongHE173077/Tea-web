const { Schema } = require("mongoose");

const COLLECTION_NAME = 'Discounts';
const DOCUMENT_NAME = 'Discount';

export const DISCOUNT_TYPE = {
    PERCENTAGE: "percentage",
    FIXED_AMOUNT: "fixed_amount"
}

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
        type: String,
        default: DISCOUNT_TYPE.PERCENTAGE,
        enum: [DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FIXED_AMOUNT]
    },
    discount_value: { type: Number, required: true, min: 0 },
    discount_code: { type: String, required: true },
    discount_max_usage: { type: Number, required: true, min: 0 }, // so luong discount co the su dung
    discount_uses_count: { type: Number, default: 0, min: 0 }, // so luong 
    discount_users_used: [{ type: Schema.Types.ObjectId, ref: 'User' }],//list of users who have used discount
    discount_max_uses_per_user: { type: Number, required: true, min: 0 },//number of times discount can be used per user
    discount_min_order_value: { type: Number, default: 0, min: 0 },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discount_start_date: { type: Date, required: true },
    discount_end_date: {
        type: Date, required: true,
        validate: {
            validator: function (value) {
                return value > this.discount_start_date;
            },
            message: "End date must be after start date"
        }
    },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, default: 'all', enum: ['all', 'specific_products', 'specific_categories'] },
    discount_products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    discount_categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Discount = model(DOCUMENT_NAME, discountSchema);

export default Discount