const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, time, category, location, image } =
      req.body;

    const event = new Event({
      name,
      description,
      date,
      time,
      category,
      location,
      image,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json({ message: "Event Created Successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error Creating Event", error });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Events", error });
  }
};

// Get Single Event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate(
      "createdBy",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event Not Found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Event", error });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {

  console.log("req updateEvent id", req.params.eventId);
  

  try {

    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ message: "Event Not Found" });

    console.log("req.user.id", req.user._id);
    
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized Action" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({ message: "Event Updated Successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error Updating Event", error });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event Not Found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized Action" });
    }

    await event.deleteOne();
    res.json({ message: "Event Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Event", error });
  }
};
