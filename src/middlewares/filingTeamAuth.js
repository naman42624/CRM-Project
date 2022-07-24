const filingTeamAuth = async (req, res, next) => {
    if (req.user.role === "Filing Team") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = filingTeamAuth;