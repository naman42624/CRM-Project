const branchManagerAuth = async (req, res, next) => {
    if (req.user.role === "Branch Manager") {
        return next();
    }
    res.status(403).redirect("/403");
};

module.exports = branchManagerAuth;