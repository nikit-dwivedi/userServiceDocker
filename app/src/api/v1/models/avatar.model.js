const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarSchema = new Schema({
    title: {
        type: String
    },
    url: {
        type: String
    }
})

exports.avatarModel = mongoose.model("avatar", avatarSchema);