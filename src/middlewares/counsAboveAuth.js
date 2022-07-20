const counsAboveAuth = async (req, res, next) => {
    if (req.user.role !== "TelleCaller" && req.user.role !== "FOE" && req.user.role !== "User") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = counsAboveAuth;