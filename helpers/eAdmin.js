module.exports = {
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "É necessário uma conta para acessar o URL em questão.");
        res.redirect("/");
    }
};