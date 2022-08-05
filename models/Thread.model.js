const { Schema, model } = require("mongoose");

const threadSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    messages: [
      {
        message: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
        created: {
          type: Date,
          default: () => Date.now(),
        },
      },
    ],
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

module.exports = model("Thread", threadSchema);
