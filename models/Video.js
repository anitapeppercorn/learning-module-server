const mongoose = require('mongoose');

const { Schema } = mongoose;

const videoSchema = new Schema({
    videoNumber: {
        type: Number,
        required: true,
        unique: true
    },
    videoTitle: {
        type: String,
        trim: true,
    },
    videoContent:{
        type: String,
        trim: true 
    },
    videoOverview: {
        type: String,
        trim: true
    },
    videoReleaseDate: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;