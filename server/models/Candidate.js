const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    name:{type : String,required : true},
    email: { type: String, required: true, unique: true },
    experience: { type: Number, required: true },
    skills: { type: [String], required: true },
    targetRole: { type: String, required: true },
    status:{
        type:String,
        enum:["Applied","Interviewed","Selected","Rejected"],
        default:"Applied"
    },
    dsaScore: { type: Number, default: 0 },
    systemDesignScore: { type: Number, default: 0 },
    projectScore: { type: Number, default: 0 },
    hrScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate',candidateSchema);