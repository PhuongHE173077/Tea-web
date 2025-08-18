const { Schema, model } = require("mongoose");

const COLLECTION_NAME = 'Roles';

const roleSchema = new Schema({
    rol_name: { type: String, default: 'user' },
    rol_slug: { type: String, required: true },
    rol_status: { type: String, default: 'active', enum: ['active', 'block', 'pending'] },
    rol_description: { type: String, default: '' },
    rol_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true }, /** Profile, Product,balance, ... */
            actions: [{ type: String, required: true }],/** read, create, update, delete */
            attributes: { type: String, default: "*" }
        }
    ],

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const Role = model('Role', roleSchema);

export default Role