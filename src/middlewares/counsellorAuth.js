const counsellorAuth = async (req, res, next) => {
    if (req.user.role === "Counsellor") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = counsellorAuth;