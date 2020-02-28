module.exports = {
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        /*if (req.isAuthenticated() && req.user.eAdmin == 0) {
            return next();
        }else if (req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }*/
        req.flash("error_msg", "É necessário uma conta para acessar o URL em questão.");
        res.redirect("/");
    }
};