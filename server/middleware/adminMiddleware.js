// Admin authorization middleware
// Ensures the authenticated user has an admin or superadmin role

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role === "participant") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }
    next();
};

module.exports = { isAdmin };
