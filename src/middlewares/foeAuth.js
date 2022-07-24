const foeAuth = async (req, res, next) => {
    if (req.user.role === "FOE") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = foeAuth;