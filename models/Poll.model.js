const { Schema, model } = require("mongoose");

const pollSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
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
    // participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Poll", pollSchema);
