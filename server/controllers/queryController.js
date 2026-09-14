const Query = require("../models/Query");
const User = require("../models/User");

// Submit a new query (Mandatory: name, email, teamName, message)
const submitQuery = async (req, res) => {
    try {
        const { name, email, teamName, message } = req.body;

        if (!name || !name.trim() || !email || !email.trim() || !teamName || !teamName.trim() || !message || !message.trim()) {
            return res.status(400).json({
                message: "All fields (Name, Email, Team Name, and Query Message) are mandatory"
            });
        }

        const query = await Query.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            teamName: teamName.trim(),
            message: message.trim()
        });

        res.status(201).json({
            message: "Your query has been submitted successfully! The organizing team will answer it here shortly.",
            query
        });

    } catch (error) {
        console.error("Submit query error:", error);
        res.status(500).json({
            message: "Server error submitting query"
        });
    }
};

// Get all queries (publicly accessible so participants can see answers on the website)
const getQueries = async (req, res) => {
    try {
        const queries = await Query.find().sort({ createdAt: -1 });
        res.status(200).json({ queries });
    } catch (error) {
        console.error("Get queries error:", error);
        res.status(500).json({
            message: "Server error fetching queries"
        });
    }
};

// Reply to a query (Admin only)
const replyToQuery = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        if (!reply || !reply.trim()) {
            return res.status(400).json({
                message: "Reply message cannot be empty"
            });
        }

        const user = await User.findById(req.user.id);
        const adminName = user ? user.name : "ISOI Admin Team";

        const query = await Query.findById(id);
        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }

        query.reply = reply.trim();
        query.repliedBy = adminName;
        query.status = "answered";
        await query.save();

        res.status(200).json({
            message: "Reply posted successfully",
            query
        });

    } catch (error) {
        console.error("Reply query error:", error);
        res.status(500).json({
            message: "Server error replying to query"
        });
    }
};

module.exports = {
    submitQuery,
    getQueries,
    replyToQuery
};
