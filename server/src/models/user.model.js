const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Users';
const DOCUMENT_NAME = 'User';

const userSchema = new Schema({
    usr_slug: { type: String, required: true, unique: true, index: true },
    usr_name: { type: String, default: '' },
    usr_password: { type: String, required: true },
    usr_salt: { type: String, default: '' },
    usr_email: { type: String, required: true, unique: true, index: true },
    usr_phone: { type: String, required: true },
    usr_avatar: { type: String, default: '' },
    usr_date_of_birth: { type: Date, default: null },
    user_address: {
        type: [
            {
                name_receiver: { type: String, default: '' },
                phone_receiver: { type: String, default: '' },
                province: { type: String, default: '' },
                district: { type: String, default: '' },
                ward: { type: String, default: '' },
                street: { type: String, default: '' },
                isDefault: { type: Boolean, default: false }
            }
        ],
        default: []
    },
    usr_role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
    usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    usr_verify_token: { type: String, default: '' },
    usr_expired_at: { type: Date, default: Date.now() + (24 * 60 * 60 * 1000) },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const User = model(DOCUMENT_NAME, userSchema);

export default User