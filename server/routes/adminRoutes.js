const express = require("express");
const {
    getAllTeams,
    getAllUsers,
    updateTeamMarks,
    updateTeamStatus,
    getOverview
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all teams (admin)
router.get("/teams", protect, isAdmin, getAllTeams);

// Get all users (admin)
router.get("/users", protect, isAdmin, getAllUsers);

// Update team marks (admin)
router.patch("/teams/:teamId/marks", protect, isAdmin, updateTeamMarks);

// Update team status / elimination (admin)
router.patch("/teams/:teamId/status", protect, isAdmin, updateTeamStatus);

module.exports = router;

