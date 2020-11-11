const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
    imageNumber: {
        type: Number,
        trim: true
    },
    imageTitle: {
        type: String,
        trim: true,
    },
    imageContent:{
        type: String,
        trim: true 
    },
    imageOverview: {
        type: String,
        trim: true
    },
    imageReleaseDate: {
        type: Date,
        default: Date.now
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;