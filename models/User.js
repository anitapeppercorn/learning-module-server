const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: (arr) => {
        return arr.filter(v => v === null).length === 0; 
    }
  }],
  completedModules: [{
    type: Schema.Types.ObjectId,
    ref: 'Module',
    validate: (arr) => {
        return arr.filter(v => v === null).length === 0; 
    }
  }],

},
    // set this to use virtual below
    {
      toJSON: {
          virtuals: true,
      },
  }
  );

// set up pre-save middleware to create password
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
