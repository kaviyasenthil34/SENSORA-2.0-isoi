const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ADMIN_ACCOUNTS = [
    {
        name: "Kaviya Senthil (Admin)",
        email: "kaviyasenthil34@gmail.com",
    },
    {
        name: "Krishna Priya (Admin)",
        email: "krishnapriyakeralapuram@gmail.com",
    }
];

const seedAdminUser = async () => {
    try {
        const defaultPassword = process.env.ADMIN_PASSWORD || "isoi@2023sensora0";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        for (const adminData of ADMIN_ACCOUNTS) {
            const email = adminData.email.toLowerCase().trim();
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                // Create new admin account
                await User.create({
                    name: adminData.name,
                    email,
                    password: hashedPassword,
                    role: "admin",
                    participantType: "external",
                    phone: "9876543210",
                    gender: "other",
                    collegeName: "ISOI Organizing Committee",
                    departmentName: "Administration",
                });
                console.log(`✅ Admin account created: ${email}`);
            } else {
                // Always sync password and ensure admin role on every server start
                existingUser.role = "admin";
                existingUser.password = hashedPassword;
                await existingUser.save();
                console.log(`🔄 Admin account synced: ${email}`);
            }
        }
    } catch (error) {
        console.error("Admin seed error:", error.message);
    }
};

module.exports = seedAdminUser;
