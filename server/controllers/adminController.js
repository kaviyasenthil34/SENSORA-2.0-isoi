const Team = require("../models/Team");
const User = require("../models/User");


// ==========================================
// GET ALL TEAMS (admin)
// ==========================================
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender")
            .sort({ createdAt: -1 });

        res.status(200).json({ teams });

    } catch (error) {
        console.error("Get all teams error:", error);
        res.status(500).json({ message: "Server error retrieving teams" });
    }
};


// ==========================================
// GET ALL USERS (admin)
// ==========================================
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .populate("team", "teamName teamCode marks")
            .sort({ createdAt: -1 });

        res.status(200).json({ users });

    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error retrieving users" });
    }
};


// ==========================================
// UPDATE TEAM MARKS (admin)
// ==========================================
const updateTeamMarks = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { marks, day1Marks, day2Marks, status, evaluationNotes } = req.body;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (marks !== undefined && marks !== null && marks !== "") {
            const num = Number(marks);
            if (isNaN(num) || num < 0) {
                return res.status(400).json({ message: "Total marks must be a non-negative number" });
            }
            team.marks = num;
        }

        if (day1Marks !== undefined && day1Marks !== null && day1Marks !== "") {
            const num1 = Number(day1Marks);
            if (isNaN(num1) || num1 < 0) {
                return res.status(400).json({ message: "Day 1 marks must be a non-negative number" });
            }
            team.day1Marks = num1;
        }

        if (day2Marks !== undefined && day2Marks !== null && day2Marks !== "") {
            const num2 = Number(day2Marks);
            if (isNaN(num2) || num2 < 0) {
                return res.status(400).json({ message: "Day 2 marks must be a non-negative number" });
            }
            team.day2Marks = num2;
        }

        if (status !== undefined && ["active", "qualified_day2", "eliminated"].includes(status)) {
            team.status = status;
        }

        if (evaluationNotes !== undefined) {
            team.evaluationNotes = String(evaluationNotes).trim();
        }

        await team.save();

        const updatedTeam = await Team.findById(team._id)
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender");

        res.status(200).json({
            message: "Team marks & evaluation updated successfully",
            team: updatedTeam
        });

    } catch (error) {
        console.error("Update team marks error:", error);
        res.status(500).json({
            message: "Server error updating team marks"
        });
    }
};

// ==========================================
// UPDATE TEAM STATUS / ELIMINATION (admin)
// ==========================================
const updateTeamStatus = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { status } = req.body;

        if (!status || !["active", "qualified_day2", "eliminated"].includes(status)) {
            return res.status(400).json({
                message: "Status must be 'active', 'qualified_day2', or 'eliminated'"
            });
        }

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        team.status = status;
        await team.save();

        const updatedTeam = await Team.findById(team._id)
            .populate("leader", "name email participantType phone gender")
            .populate("members", "name email participantType phone gender");

        res.status(200).json({
            message: `Team status updated to ${status}`,
            team: updatedTeam
        });

    } catch (error) {
        console.error("Update team status error:", error);
        res.status(500).json({
            message: "Server error updating team status"
        });
    }
};

// ==========================================
// GET OVERVIEW (admin) – combined users & teams
// ==========================================
const getOverview = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('leader', 'name email participantType phone gender')
      .populate('members', 'name email participantType phone gender')
      .sort({ createdAt: -1 });

    const users = await User.find()
      .select('-password')
      .populate('team', 'teamName teamCode marks status')
      .sort({ createdAt: -1 });

    res.status(200).json({ teams, users });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ message: 'Server error retrieving overview' });
  }
};


module.exports = {
    getAllTeams,
    getAllUsers,
    updateTeamMarks,
    updateTeamStatus,
    getOverview
};

