const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Ships';
const DOCUMENT_NAME = 'Ship';

const shipSchema = new Schema({
    freeShippingThreshold: {
        type: Number,
        required: true,
        min: [0, 'Free shipping threshold must be greater than or equal to 0'],
        default: 0
    },
    shippingFee: {
        type: Number,
        required: true,
        min: [0, 'Shipping fee must be greater than or equal to 0'],
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    description: {
        type: String,
        default: '',
        maxlength: [500, 'Description cannot exceed 500 characters']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// Index để tối ưu query
shipSchema.index({ isActive: 1, createdAt: -1 });
shipSchema.index({ createdBy: 1 });

// Virtual để format currency
shipSchema.virtual('formattedShippingFee').get(function () {
    return this.shippingFee.toLocaleString('vi-VN') + ' VNĐ';
});

shipSchema.virtual('formattedFreeShippingThreshold').get(function () {
    return this.freeShippingThreshold.toLocaleString('vi-VN') + ' VNĐ';
});

// Instance method để tính phí ship dựa trên giá trị đơn hàng
shipSchema.methods.calculateShippingFee = function (orderValue) {
    if (!this.isActive) {
        throw new Error('Shipping configuration is not active');
    }

    if (orderValue >= this.freeShippingThreshold) {
        return 0; // Miễn phí ship
    }

    return this.shippingFee;
};

// Static method để lấy config active
shipSchema.statics.getActiveConfig = async function () {
    return await this.findOne({ isActive: true })
        .populate('createdBy', 'usr_name usr_email')
        .populate('updatedBy', 'usr_name usr_email');
};

// Static method để tính phí ship cho đơn hàng
shipSchema.statics.calculateShippingFeeForOrder = async function (orderValue) {
    const activeConfig = await this.getActiveConfig();

    if (!activeConfig) {
        throw new Error('No active shipping configuration found');
    }

    return activeConfig.calculateShippingFee(orderValue);
};

// Pre-save middleware để đảm bảo chỉ có 1 config active
shipSchema.pre('save', async function (next) {
    if (this.isActive && this.isModified('isActive')) {
        // Nếu config này được set active, deactivate tất cả config khác
        await this.constructor.updateMany(
            { _id: { $ne: this._id }, isActive: true },
            { isActive: false }
        );
    }
    next();
});

const Ship = model(DOCUMENT_NAME, shipSchema);

export default Ship;