const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    url: {
        type: String, 
        required: true
    },
    date: {
        type: String
    },
    hour: {
        type: Number
    },
    minute: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

exports.storyModel = mongoose.model("story", storySchema)