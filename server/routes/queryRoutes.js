const express = require("express");
const { submitQuery, getQueries, replyToQuery } = require("../controllers/queryController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public: Submit a query
router.post("/", submitQuery);

// Public: View queries and answers
router.get("/", getQueries);

// Admin: Reply to a query
router.patch("/:id/reply", protect, isAdmin, replyToQuery);

module.exports = router;
