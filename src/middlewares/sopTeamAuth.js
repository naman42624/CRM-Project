const sopTeamAuth = async (req, res, next) => {
    if (req.user.role === "SOP Team") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = sopTeamAuth;