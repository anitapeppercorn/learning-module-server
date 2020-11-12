const mongoose = require('mongoose');

const { Schema } = mongoose;

const moduleSchema = new Schema({
  moduleNumber: {
    type: Number,
    required: true
  },
  moduleTitle: {
    type: String,
    required: true,
    trim: true
  },
  moduleOverview: {
    type: String
  },
  moduleReleaseDate: {
    type: Date,
    default: Date.now
  },
  moduleCategory: {
    type: String,
    required: true,
    trim: true
  },
  modulePoster: {
    type: String
  },
  moduleVideo: [
    {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    }
  ],
  moduleLesson: [ 
    {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  } 
]
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
