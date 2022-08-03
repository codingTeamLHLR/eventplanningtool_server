const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String, 
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true, 
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    username: {
      type: String,
      required: [true, 'Username is required.'],
    },
    birthday: {
      type: Date, 
      required: [true, 'Birthday is required.'],
      min: () => Date.now() - 24 * 60 * 60 * 365 * 110,
      max: () => Date.now() 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
