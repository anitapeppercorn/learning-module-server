const mongoose = require('mongoose');

const { Schema } = mongoose;

const paragraphSchema = new Schema({
  paragraphRef: {
    type: String,
    required: true,
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
    paragraphPoster: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Poster'
        }
    ],
    paragraphVideo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    paragraphReleaseDate: {
        type: String,
        default: Date.now
    }
});

const Paragraph = mongoose.model('Paragraph', paragraphSchema);

module.exports = Paragraph;
