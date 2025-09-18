const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Discounts';
const DOCUMENT_NAME = 'Discount';

const DISCOUNT_TYPE = {
    PERCENTAGE: "percentage",
    FIXED_AMOUNT: "fixed_amount"
}

const discountSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    discount_type: {
        type: String,
        required: true,
        enum: [DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FIXED_AMOUNT]
    },
    discount_value: {
        type: Number,
        required: true,
        min: [0, 'Discount value must be greater than or equal to 0']
    },
    min_order_value: {
        type: Number,
        default: 0,
        min: [0, 'Minimum order value must be greater than or equal to 0']
    },
    max_discount_amount: {
        type: Number,
        default: null,
        min: [0, 'Maximum discount amount must be greater than or equal to 0']
    },
    start_date: { type: Date, required: true },
    end_date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.start_date;
            },
            message: "End date must be after start date"
        }
    },
    usage_limit: {
        type: Number,
        required: true,
        min: [1, 'Usage limit must be at least 1']
    },
    used_count: {
        type: Number,
        default: 0,
        min: [0, 'Used count cannot be negative']
    },
    is_active: { type: Boolean, default: true },

    // Thêm các trường để tracking
    users_used: [{
        user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        used_at: { type: Date, default: Date.now },
        order_id: { type: Schema.Types.ObjectId, ref: 'Order' }
    }],
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// Index để tối ưu query
// Note: code field already has unique index, no need for additional index
discountSchema.index({ is_active: 1, start_date: 1, end_date: 1 });
discountSchema.index({ created_by: 1 });

// Virtual để check xem discount có còn hiệu lực không
discountSchema.virtual('is_valid').get(function () {
    const now = new Date();
    return this.is_active &&
        this.start_date <= now &&
        this.end_date >= now &&
        this.used_count < this.usage_limit;
});

// Virtual để check xem discount có hết hạn không
discountSchema.virtual('is_expired').get(function () {
    return new Date() > this.end_date;
});

// Method để check xem user đã sử dụng discount này chưa
discountSchema.methods.isUsedByUser = function (userId) {
    return this.users_used.some(usage => usage.user_id.toString() === userId.toString());
};

// Method để apply discount
discountSchema.methods.applyDiscount = function (orderValue) {
    if (!this.is_valid) {
        throw new Error('Discount is not valid');
    }

    if (orderValue < this.min_order_value) {
        throw new Error(`Minimum order value is ${this.min_order_value}`);
    }

    let discountAmount = 0;

    if (this.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
        discountAmount = (orderValue * this.discount_value) / 100;
        if (this.max_discount_amount && discountAmount > this.max_discount_amount) {
            discountAmount = this.max_discount_amount;
        }
    } else {
        discountAmount = this.discount_value;
    }

    return Math.min(discountAmount, orderValue);
};

const Discount = model(DOCUMENT_NAME, discountSchema);

module.exports = Discount;
module.exports.DISCOUNT_TYPE = DISCOUNT_TYPE;