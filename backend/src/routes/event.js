const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { userAuth } = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

const router = express.Router();

router.post("/event", userAuth,isAdmin, createEvent);
router.get("/event", getAllEvents);
router.get("/event/:eventId", getEventById);
router.put("/event/:eventId", userAuth, isAdmin, updateEvent);
router.delete("/event/:eventId", userAuth,isAdmin ,deleteEvent);

module.exports = router;
