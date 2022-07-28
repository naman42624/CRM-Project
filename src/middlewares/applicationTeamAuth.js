const applicationTeamAuth = async (req, res, next) => {
    if (req.user.role === "Application Team") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = applicationTeamAuth;