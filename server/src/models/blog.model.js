const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Blogs';
const DOCUMENT_NAME = 'Blog';

const blogSchema = new Schema({
    blog_title: { type: String, required: true, trim: true },
    blog_slug: { type: String, required: true, unique: true, index: true },
    blog_content: { type: String, required: true },
    blog_excerpt: { type: String, required: false, maxlength: 500 },
    blog_thumbnail: {
        url: { type: String, required: false },
        alt: { type: String, default: '' }
    },
    blog_author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blog_category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    blog_tags: [{ type: String, trim: true }],
    blog_status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    blog_published_at: { type: Date, default: null },
    blog_views: { type: Number, default: 0 },
    blog_likes: { type: Number, default: 0 },
    blog_meta: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        keywords: [{ type: String }]
    },
    blog_featured: { type: Boolean, default: false },
    blog_reading_time: { type: Number, default: 0 } // in minutes
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// Index for better search performance
blogSchema.index({ blog_title: 'text', blog_content: 'text', blog_excerpt: 'text' });
blogSchema.index({ blog_status: 1, createdAt: -1 });
blogSchema.index({ blog_author: 1 });
blogSchema.index({ blog_category: 1 });

const Blog = model(DOCUMENT_NAME, blogSchema);

export default Blog;