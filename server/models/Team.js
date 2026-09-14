const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        teamName: {
            type: String,
            required: true,
            trim: true
        },

        teamCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        participantType: {
            type: String,
            enum: ["internal", "external"],
            required: true
        },

        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        projectDescription: {
            type: String,
            default: "",
            trim: true
        },

        // Day 2 Elimination Status
        status: {
            type: String,
            enum: ["active", "qualified_day2", "eliminated"],
            default: "active"
        },

        // Day 1 & Day 2 Evaluation Marks (Confidential, Admin-only)
        day1Marks: {
            type: Number,
            default: null,
            min: 0
        },

        day2Marks: {
            type: Number,
            default: null,
            min: 0
        },

        marks: {
            type: Number,
            default: null,
            min: 0
        },

        evaluationNotes: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Team", teamSchema);