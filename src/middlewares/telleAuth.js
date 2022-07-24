const telleAuth = async (req, res, next) => {
    if (req.user.role === "TelleCaller") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = telleAuth;