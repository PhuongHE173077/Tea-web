const { Schema, model } = require("mongoose");
const COLLECTION_NAME = 'LandingPages';
const DOCUMENT_NAME = 'LandingPage';

const LandingPageSchema = new Schema({
    header: {
        title: { type: String, required: true },
        detail: { type: String, required: true },
        imageCover: { type: String, required: true },
        attribute: { type: Array, default: [] },
        isActive: { type: Boolean, default: true }
    },
    aboutSection: {
        title: { type: String, required: true },
        detail: { type: String, required: true },
        attribute: [
            {
                icon: { type: String, required: true },
                title: { type: String, required: true },
                detail: { type: String, required: true },
            }
        ],
        isActive: { type: Boolean, default: true }
    },
    video: {
        url: { type: String, required: true },
        isActive: { type: Boolean, default: true }
    },
    mainSection: [
        {
            title: { type: String, required: true },
            detail: { type: String, required: true },
            imageCover: { type: String, required: true },
            isActive: { type: Boolean, default: true }
        }
    ],
    eventSection: {
        tag: { type: Array, default: [] },
        title: { type: String, required: true },
        detail: { type: String, required: true },
        imageCol1: { type: Array, default: [] },
        imageCol2: { type: Array, default: [] },
        subSection: [{
            title: { type: String, required: true },
            detail: { type: String, required: true },
        }],
        isActive: { type: Boolean, default: true }
    },
    carousel: {
        title: { type: String, required: true },
        detail: { type: String, required: true },
        carouselList: { type: Array, default: [] },
        isActive: { type: Boolean, default: true }
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const LandingPage = model(DOCUMENT_NAME, LandingPageSchema);

module.exports = LandingPage;