const mongoose = require('mongoose');

const { Schema } = mongoose;

const paragraphSchema = new Schema({
    paragraphRef: {
        type: Number,
        trim: true
        },
    paragraphNumber: {
        type: Number,
        trim: true
        },
    paragraphContent: {
        type: String,
        trim: true,
    },
    paragraphReleaseDate: {
        type: String,
        default: Date.now
    },
    paragraphImage: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image',
            validate: (arr) => {
                return arr.filter(v => v === null).length === 0; 
            }
        }
    ],
    paragraphVideo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            validate: (arr) => {
                return arr.filter(v => v === null).length === 0; 
            }
        }
    ]
});

const Paragraph = mongoose.model('Paragraph', paragraphSchema);

module.exports = Paragraph;
