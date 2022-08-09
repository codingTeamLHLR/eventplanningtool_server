const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for your event."],
    },
    date: {
      type: Date,
      min: () => Date.now(),
    },
    location: {
      street: String,
      housenumber: String,
      citycode: String,
      city: String,
      country: String,
    },
    // participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    participants: [{
      user: {type: Schema.Types.ObjectId, ref: 'User'}, 
      status: {
        type: String, 
        enum: ["accepted", "pending", "declined"],
        default: "pending"
      }
    }],
    threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
    polls: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
    organizers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    image: String,
    public: {
      type: Boolean, 
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Event", eventSchema);
