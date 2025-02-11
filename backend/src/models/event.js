const mongoose = require("mongoose");
const validator = require("validator");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 1000, // Limit description to 1000 characters
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      validate(value) {
        if (value < new Date()) {
          throw new Error("Event date must be in the future");
        }
      },
    },
    time: {
      type: String,
      required: true,
      validate(value) {
        const timeFormat = /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i; // 12-hour format
        if (!timeFormat.test(value)) {
          throw new Error(
            "Time must be in HH:MM AM/PM format (e.g., 02:30 PM)"
          );
        }
      },
    },
    category: {
      type: String,
      enum: [
        "Conference",
        "Workshop",
        "Meetup",
        "Webinar",
        "Business",
        "Education",
        "Entertainment",
        "Technology",
      ],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Array of user IDs
    image: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Image must be a valid URL");
        }
      },
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Event", EventSchema);
