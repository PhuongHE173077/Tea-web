const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'CompanyInfos';
const DOCUMENT_NAME = 'CompanyInfo';

const CompanyInfoSchema = new Schema({
    company_name: { type: String, required: true },
    company_description: { type: String, required: true },
    company_address: { type: String, required: true },
    company_phone: { type: String, required: true },
    company_email: { type: String, required: true },
    company_facebook: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_instagram: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_youtube: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_tiktok: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_twitter: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_linkedin: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_shopee: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    company_zalo: {
        url: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const CompanyInfo = model(DOCUMENT_NAME, CompanyInfoSchema);

module.exports = CompanyInfo;