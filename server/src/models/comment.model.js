const { Schema } = require("mongoose");

const COLLECTION_NAME = 'Comments';
const DOCUMENT_NAME = 'Comment';

const commentSchema = new Schema({
    comment_productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    comment_userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment_content: { type: String, required: true },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


const Comment = model(DOCUMENT_NAME, commentSchema);

export default Comment