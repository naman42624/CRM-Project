const isVerified = async (req, res, next) => {
    if (req.user.isVerified === true) {
        return next();
    }
    res.status(403).redirect("/user/verify");
};

module.exports = isVerified;