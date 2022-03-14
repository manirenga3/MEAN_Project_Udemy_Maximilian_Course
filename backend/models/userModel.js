import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: [validator.isEmail, 'Please provide valid email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please provide confirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords did not matched',
    },
    select: false,
  },
});

userSchema.plugin(mongooseUniqueValidator, {
  message: `{PATH} already exists! Please try another one`,
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePwd = async function (inputPwd, userPwd) {
  return await bcrypt.compare(inputPwd, userPwd);
};

export const User = mongoose.model('User', userSchema);
