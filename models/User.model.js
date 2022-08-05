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
    birthdate: {
      type: Date, 
      required: [true, 'Birthdate is required.'],
      min: () => "1900-01-01",
      max: () => Date.now() 
    },
    image: String
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
