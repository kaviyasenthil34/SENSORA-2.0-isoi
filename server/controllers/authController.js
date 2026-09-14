const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ===============================
// REGISTER USER
// ===============================
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            gender,
            registrationNumber,
            hostelDetails,
            collegeName,
            departmentName
        } = req.body;

        // Check common required fields
        if (!name || !email || !password || !phone || !gender) {
            return res.status(400).json({
                message: "Name, email, password, phone, and gender are required"
            });
        }

        // Validate gender enum
        const normalizedGender = gender.toLowerCase().trim();
        if (!["male", "female", "other"].includes(normalizedGender)) {
            return res.status(400).json({
                message: "Gender must be 'male', 'female', or 'other'"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Determine participant type (domain auto-detection)
        let participantType;
        if (normalizedEmail.endsWith("@vitstudent.ac.in")) {
            participantType = "internal";
        } else if (normalizedEmail.endsWith("@gmail.com")) {
            participantType = "external";
        } else {
            return res.status(400).json({
                message: "Only @vitstudent.ac.in and @gmail.com email addresses are allowed"
            });
        }

        // Type-specific field validations
        if (participantType === "internal") {
            if (!registrationNumber || !registrationNumber.trim()) {
                return res.status(400).json({
                    message: "Registration number is required for internal participants"
                });
            }
            if (!hostelDetails || !hostelDetails.trim()) {
                return res.status(400).json({
                    message: "Hostel details are required for internal participants"
                });
            }
        } else if (participantType === "external") {
            if (!collegeName || !collegeName.trim()) {
                return res.status(400).json({
                    message: "College name is required for external participants"
                });
            }
            if (!departmentName || !departmentName.trim()) {
                return res.status(400).json({
                    message: "Department name is required for external participants"
                });
            }
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email address"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const ADMIN_EMAILS = [
            "kaviyasenthil34@gmail.com",
            "krishnapriyakeralapuram@gmail.com"
        ];

        const userRole = ADMIN_EMAILS.includes(normalizedEmail) ? "admin" : "participant";

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
            phone: phone.trim(),
            gender: normalizedGender,
            participantType,
            registrationNumber: participantType === "internal" ? registrationNumber.trim() : "",
            hostelDetails: participantType === "internal" ? hostelDetails.trim() : "",
            collegeName: participantType === "external" ? collegeName.trim() : "",
            departmentName: participantType === "external" ? departmentName.trim() : ""
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                participantType: user.participantType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                participantType: user.participantType,
                registrationNumber: user.registrationNumber,
                hostelDetails: user.hostelDetails,
                collegeName: user.collegeName,
                departmentName: user.departmentName,
                team: user.team
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const ADMIN_EMAILS = [
            "kaviyasenthil34@gmail.com",
            "krishnapriyakeralapuram@gmail.com"
        ];
        if (ADMIN_EMAILS.includes(normalizedEmail) && user.role !== "admin" && user.role !== "superadmin") {
            user.role = "admin";
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                participantType: user.participantType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                participantType: user.participantType,
                registrationNumber: user.registrationNumber,
                hostelDetails: user.hostelDetails,
                collegeName: user.collegeName,
                departmentName: user.departmentName,
                team: user.team
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error during login"
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};
