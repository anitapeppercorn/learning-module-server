const mongoose = require('mongoose');

const { Schema } = mongoose;

const progressSchema = new Schema({
  finishDate: {
    type: Date,
    default: Date.now
  },
  modules: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Module'
    }
  ]
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
