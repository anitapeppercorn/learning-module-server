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
  modulePoster: {
    type: String
  },
  moduleCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  moduleVideo: [
    {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    }
  ],
  moduleSection: [ 
    {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  } 
]
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
