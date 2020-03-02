// Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const admin = require('./routes/admin');
const path = require("path");
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');
//const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport);
const db = require("./config/db");

//
// Models
//

    require("./models/Postagem");
    const Postagem = mongoose.model("postagens");
    require("./models/Categoria");
    const Categoria = mongoose.model("categorias");

//
// Configurações
//
    //
    // Sessão
    //
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    //
    // Middleware
    //
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next()
    });

    //
    // Body Parser
    //

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //
    // Handlebars
    //

    app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

    //
    // Moongoose
    //
    mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("**** Status -> Conexão MongoDB: [Online]");
    }).catch((err) => {
        console.log("**** Status -> Conexão MongoDB: [Offline] " + err);
    })

    // Public e Images
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static('views/images'));


//
// Rotas
//

    app.use('/usuario', admin);
    //app.use('/usuarios', usuarios);

    app.get('/', (req, res) => {
        if(req.user != null){
            res.redirect("/usuario");
        }else{
            res.render("index");
        }
    });

    app.get("/404", (req, res) => {
        res.send('Erro 404!');
    });


//
// Outros
//
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log("**** Status -> Servidor: [Online]");
    });