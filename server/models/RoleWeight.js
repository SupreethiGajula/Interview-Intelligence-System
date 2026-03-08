const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleWeightSchema = new Schema({
    role: { type: String, required: true, unique: true },

    dsaWeight: { type: Number, required: true },
    systemDesignWeight: { type: Number, required: true },
    projectWeight: { type: Number, required: true },
    hrWeight: { type: Number, required: true }
});

module.exports = mongoose.model('RoleWeight',roleWeightSchema);