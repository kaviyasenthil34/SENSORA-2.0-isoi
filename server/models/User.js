const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["participant", "admin", "superadmin"],
            default: "participant"
        },

        participantType: {
            type: String,
            enum: ["internal", "external"],
            required: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },

        // Type-specific fields
        // Internal participants (@vitstudent.ac.in)
        registrationNumber: {
            type: String,
            trim: true,
            default: ""
        },

        hostelDetails: {
            type: String,
            trim: true,
            default: ""
        },

        // External participants (other emails)
        collegeName: {
            type: String,
            trim: true,
            default: ""
        },

        departmentName: {
            type: String,
            trim: true,
            default: ""
        },

        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);