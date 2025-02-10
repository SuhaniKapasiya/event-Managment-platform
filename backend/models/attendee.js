const mongoose = require("mongoose");

const AttendeeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      validate(value) {
        if (value > new Date()) {
          throw new Error("Join date cannot be in the future");
        }
      },
    },
  },
  { timestamps: true }
);

// Ensure a user can only join an event once
AttendeeSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Attendee", AttendeeSchema);
