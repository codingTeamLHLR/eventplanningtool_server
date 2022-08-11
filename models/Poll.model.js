const { Schema, model } = require("mongoose");

const pollSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    options: [
      {
        name: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        voted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Poll", pollSchema);
