const mongoose = require('mongoose');

const { Schema } = mongoose;

const sectionSchema = new Schema({
  sectionNumber: {
    type: Number,
    trim: true
  },
  sectionTitle: {
    type: String,
    required: true,
    trim: true
  },
  sectionOverview: {
    type: String,
    trim: true
  },
  sectionParagraph: [
    {
    type: Schema.Types.ObjectId,
    ref: 'Paragraph'
  }
]
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
