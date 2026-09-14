const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        teamName: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        reply: {
            type: String,
            default: "",
            trim: true
        },

        repliedBy: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "answered"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Query", querySchema);
