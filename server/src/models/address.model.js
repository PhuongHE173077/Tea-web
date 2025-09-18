const { Schema, model } = require("mongoose");

const COLLECTION_NAME_PROVINCE = 'Provinces';
const DOCUMENT_NAME_PROVINCE = 'Province';

const COLLECTION_NAME_DISTRICT = 'Districts';
const DOCUMENT_NAME_DISTRICT = 'District';

// Province Schema
const provinceSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    name_en: {
        type: String,
        default: '',
        trim: true
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    full_name_en: {
        type: String,
        default: '',
        trim: true
    },
    code_name: {
        type: String,
        required: true,
        trim: true
    },
    administrative_unit_id: {
        type: Number,
        default: null
    },
    administrative_region_id: {
        type: Number,
        default: null
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME_PROVINCE
});

// District Schema
const districtSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    name_en: {
        type: String,
        default: '',
        trim: true
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    full_name_en: {
        type: String,
        default: '',
        trim: true
    },
    code_name: {
        type: String,
        required: true,
        trim: true
    },
    province_code: {
        type: String,
        required: true,
        ref: 'Province',
        index: true
    },
    administrative_unit_id: {
        type: Number,
        default: null
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME_DISTRICT
});

// Indexes
// Note: code field already has unique index, no need for additional index
provinceSchema.index({ name: 'text', full_name: 'text' });
// Note: code field already has unique index, no need for additional index
districtSchema.index({ name: 'text', full_name: 'text' });
districtSchema.index({ province_code: 1, is_active: 1 });

// Static methods for Province
provinceSchema.statics.findActive = function () {
    return this.find({ is_active: true }).sort({ name: 1 });
};

provinceSchema.statics.findByCode = function (code) {
    return this.findOne({ code: code, is_active: true });
};

provinceSchema.statics.searchByName = function (searchTerm) {
    return this.find({
        is_active: true,
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { full_name: { $regex: searchTerm, $options: 'i' } },
            { code_name: { $regex: searchTerm, $options: 'i' } }
        ]
    }).sort({ name: 1 });
};

// Static methods for District
districtSchema.statics.findByProvinceCode = function (provinceCode) {
    return this.find({
        province_code: provinceCode,
        is_active: true
    }).sort({ name: 1 });
};

districtSchema.statics.findByCode = function (code) {
    return this.findOne({ code: code, is_active: true });
};

districtSchema.statics.searchByName = function (provinceCode, searchTerm) {
    const query = {
        province_code: provinceCode,
        is_active: true
    };

    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { full_name: { $regex: searchTerm, $options: 'i' } },
            { code_name: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    return this.find(query).sort({ name: 1 });
};

// Ward Schema
const DOCUMENT_NAME_WARD = 'Ward';
const COLLECTION_NAME_WARD = 'wards';

const wardSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    name_en: {
        type: String,
        default: '',
        trim: true
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    full_name_en: {
        type: String,
        default: '',
        trim: true
    },
    code_name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    district_code: {
        type: String,
        required: true,
        index: true,
        ref: DOCUMENT_NAME_DISTRICT
    },
    administrative_unit_id: {
        type: Number,
        default: null
    },
    is_active: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME_WARD
});

// Ward indexes
// Note: code field already has unique index, no need for additional index
wardSchema.index({ district_code: 1, is_active: 1 });
wardSchema.index({ name: 'text', full_name: 'text' });

// Ward static methods
wardSchema.statics.findActive = function (filters = {}) {
    return this.find({ is_active: true, ...filters });
};

wardSchema.statics.findByDistrictCode = function (districtCode, filters = {}) {
    return this.findActive({ district_code: districtCode, ...filters });
};

wardSchema.statics.searchByName = function (searchTerm, districtCode = null) {
    const query = {
        is_active: true,
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { full_name: { $regex: searchTerm, $options: 'i' } },
            { code_name: { $regex: searchTerm, $options: 'i' } }
        ]
    };

    if (districtCode) {
        query.district_code = districtCode;
    }

    return this.find(query);
};

const Province = model(DOCUMENT_NAME_PROVINCE, provinceSchema);
const District = model(DOCUMENT_NAME_DISTRICT, districtSchema);
const Ward = model(DOCUMENT_NAME_WARD, wardSchema);

module.exports = {
    Province,
    District,
    Ward
};
