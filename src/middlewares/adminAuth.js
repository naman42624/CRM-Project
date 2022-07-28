const adminAuth = async (req, res, next) => {
    if (req.user.role === "Admin") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = adminAuth;