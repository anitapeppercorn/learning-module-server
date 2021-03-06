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
  lessonSection: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      validate: (arr) => {
        return arr.filter(v => v === null).length === 0; 
    }
    }
  ],
  lessonTime:{
    type: String,
    trim: true
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
