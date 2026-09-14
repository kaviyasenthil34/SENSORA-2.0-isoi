const Team = require("../models/Team");
const User = require("../models/User");

// Helper to strip confidential marks from team objects returned to participants
const sanitizeTeamForParticipant = (teamDoc) => {
    if (!teamDoc) return null;
    const teamObj = teamDoc.toObject ? teamDoc.toObject() : { ...teamDoc };
    delete teamObj.marks;
    delete teamObj.day1Marks;
    delete teamObj.day2Marks;
    delete teamObj.evaluationNotes;
    return teamObj;
};


// ==========================================
// GENERATE UNIQUE TEAM CODE
// ==========================================
const generateTeamCode = async () => {
    let teamCode;
    let existingTeam;

    do {
        const randomPart = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        teamCode = `ISOI-${randomPart}`;

        existingTeam = await Team.findOne({
            teamCode
        });

    } while (existingTeam);

    return teamCode;
};


// ==========================================
// CREATE TEAM
// ==========================================
const createTeam = async (req, res) => {
    try {
        const { teamName } = req.body;

        // Check team name
        if (!teamName || !teamName.trim()) {
            return res.status(400).json({
                message: "Team name is required"
            });
        }

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check whether user already belongs to a team
        if (user.team) {
            return res.status(400).json({
                message: "You are already part of a team"
            });
        }

        // Generate unique team code
        const teamCode = await generateTeamCode();

        // Create team
        const team = await Team.create({
            teamName: teamName.trim(),
            teamCode,
            participantType: user.participantType,
            leader: user._id,
            members: [user._id],
            projectDescription: "",
            marks: null
        });

        // Update user's team
        user.team = team._id;
        await user.save();

        const populatedTeam = await Team.findById(team._id)
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender");

        res.status(201).json({
            message: "Team created successfully",
            team: sanitizeTeamForParticipant(populatedTeam)
        });

    } catch (error) {
        console.error("Create team error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// JOIN TEAM
// ==========================================
const joinTeam = async (req, res) => {
    try {
        const { teamCode } = req.body;

        if (!teamCode || !teamCode.trim()) {
            return res.status(400).json({
                message: "Team code is required"
            });
        }

        // Find user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if already in a team
        if (user.team) {
            return res.status(400).json({
                message: "You are already part of a team"
            });
        }

        // Find team
        const team = await Team.findOne({
            teamCode: teamCode.toUpperCase().trim()
        });

        if (!team) {
            return res.status(404).json({
                message: "Team not found. Check the team code."
            });
        }

        // Check maximum team size
        if (team.members.length >= 4) {
            return res.status(400).json({
                message: "Team is already full. Maximum 4 members allowed."
            });
        }

        // Check participant type
        if (team.participantType !== user.participantType) {
            return res.status(400).json({
                message:
                    "You cannot join this team. Internal and external participants cannot be mixed."
            });
        }

        // Add user to team
        team.members.push(user._id);
        await team.save();

        // Update user's team
        user.team = team._id;
        await user.save();

        const populatedTeam = await Team.findById(team._id)
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender");

        res.status(200).json({
            message: "Joined team successfully",
            team: sanitizeTeamForParticipant(populatedTeam)
        });

    } catch (error) {
        console.error("Join team error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET MY TEAM
// ==========================================
const getMyTeam = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.team) {
            return res.status(404).json({
                message: "You are not part of any team"
            });
        }

        const team = await Team.findById(user.team)
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender");

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        res.status(200).json({
            team: sanitizeTeamForParticipant(team)
        });

    } catch (error) {
        console.error("Get team error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE PROJECT DESCRIPTION (Leader only)
// ==========================================
const updateProjectDescription = async (req, res) => {
    try {
        const { projectDescription } = req.body;

        if (projectDescription === undefined || projectDescription === null) {
            return res.status(400).json({
                message: "projectDescription is required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user || !user.team) {
            return res.status(404).json({
                message: "You are not part of any team"
            });
        }

        const team = await Team.findById(user.team);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        // Verify that only the leader may set/update project description
        if (team.leader.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "Only the team leader can update the project description"
            });
        }

        team.projectDescription = typeof projectDescription === "string" ? projectDescription.trim() : "";
        await team.save();

        const updatedTeam = await Team.findById(team._id)
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender");

        res.status(200).json({
            message: "Project description updated successfully",
            team: sanitizeTeamForParticipant(updatedTeam)
        });

    } catch (error) {
        console.error("Update project description error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createTeam,
    joinTeam,
    getMyTeam,
    updateProjectDescription
};