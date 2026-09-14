const express = require("express");

const {
    createTeam,
    joinTeam,
    getMyTeam,
    updateProjectDescription
} = require("../controllers/teamController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Create a team
router.post("/create", protect, createTeam);

// Join an existing team
router.post("/join", protect, joinTeam);

// Get logged-in user's team
router.get("/my-team", protect, getMyTeam);

// Update project description (Leader only)
router.patch("/description", protect, updateProjectDescription);


module.exports = router;