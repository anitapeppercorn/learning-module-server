const mongoose = require('mongoose');

const { Schema } = mongoose;

const lessonSchema = new Schema({
  lessonNumber: {
    type: Number,
    trim: true,
  },
  lessonTitle: {
    type: String,
    trim: true
  },
  lessonOverview: {
    type: String,
    trim: true
  },
  lessonReleaseDate: {
    type: Date,
    default: Date.now
  },
  lessonParagraph: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Paragraph',
    }
  ],
  time:{
    type: String,
    trim: true
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
