const { Schema } = require("mongoose");
const { type } = require("os");

const COLLECTION_NAME = 'Skus';
const DOCUMENT_NAME = 'Sku';

const skuSchema = new Schema({
    sku_tier_idx: { type: Array, default: [0] },//[0,1]

    /**
     color =[red,green]= [0,1]
     size = [S,M,L]= [0,1,2]
    
     =>red + S=[0,1]
     =>red + M=[0,2]
     =>red + L=[0,3]
     */

    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: 0, unique: true },
    sku_price: { type: String, required: true },
    sku_stock: { type: String, default: 0 },
    sku_sort: { type: Number, default: 0 },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME

})

const SKU = model(DOCUMENT_NAME, skuSchema);

export default SKU