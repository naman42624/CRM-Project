const interviewTeamAuth = async (req, res, next) => {
    if (req.user.role === "Interview Team") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = interviewTeamAuth;