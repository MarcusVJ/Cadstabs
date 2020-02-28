const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport")

//
// Models
//

    require("../models/Categoria");
    const Categoria = mongoose.model("categorias");
    require('../models/Postagem');
    const Postagem = mongoose.model("postagens");
    require('../models/Estabelecimentos');
    const Estabelecimento = mongoose.model("estabelecimentos");
    require("../models/Usuario");
    const Usuario = mongoose.model("usuarios");

//
// Helpers
//
    const { eAdmin } = require("../helpers/eAdmin");

//
//Rotas
//

    //
    // Root
    //

        router.get('/', eAdmin, (req, res) => {
            res.render("admin/index");
        });

    //
    // Categorias
    //

        router.get("/categorias", eAdmin, (req, res) => {
            Categoria.find().sort({ date: 'desc' }).then((categorias) => {
                res.render("admin/categorias", {categorias: categorias});
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao listar as categorias");
                res.redirect("/usuario");
            });
        });

        router.get("/categorias/add", eAdmin, (req, res) => {
            res.render("admin/addcategorias");
        });

        router.post("/categorias/nova", eAdmin, (req, res) => {
            var erros = [];

            if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
                erros.push({ texto: "Nome inválido." });
            }
            if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
                erros.push({ texto: "Slug inválido." });
            }
            if (req.body.nome.length < 2) {
                erros.push({ texto: "Nome de categoria precisa ter mais que dois caractéres." });
            }
            if (erros.length > 0) {
                res.render("admin/addcategorias", { erros: erros })
            } else {
                const novaCategoria = {
                    nome: req.body.nome,
                    slug: req.body.slug
                };
                new Categoria(novaCategoria).save().then(() => {
                    req.flash("success_msg", "Categoria criada com sucesso!");
                    res.redirect("/admin/categorias");
                    console.log("Categoria salva com sucesso!");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!");
                    res.redirect("/admin/categorias");
                });
            }
        });

        router.get("/categorias/edit/:id", eAdmin, (req, res) => {
            Categoria.findOne({ _id: req.params.id }).then((categoria) => {
                res.render("admin/editcategorias", { categoria: categoria });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Esta categoria não existe");
                res.redirect("/admin/categorias");
            });
        });

        router.post("/categorias/edit", eAdmin, (req, res) => {

            Categoria.findOne({ _id: req.body.id }).then((categoria) => {

                categoria.nome = req.body.nome;
                categoria.slug = req.body.slug;

                categoria.save().then(() => {
                    res.flash("success_msg", "Categoria editada com sucesso!");
                    res.redirect("/usuario/categorias");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria");
                    res.redirect("/usuario/categorias");
                });

            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao editar a categoria")
                res.redirect("/usuario/categorias")
            });
        });

        router.post("/categorias/deletar", eAdmin, (req, res) => {
            Categoria.remove({ _id: req.body.id }).then(() => {
                req.flash("success_msg", "Categoria deletada com sucesso!")
                res.redirect("/usuario/categorias");
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao deletar a categoria")
                res.redirect("/usuario/categorias");
            });
        });

    router.get("/categorias/:slug", eAdmin, (req, res) => {
        Categoria.findOne({ slug: req.params.slug }).then((categoria) => {
            if (categoria) {
                Postagem.find({ categoria: categoria._id }).then((postagens) => {
                    res.render("admin/categorias/postagens", {postagens: postagens, categoria: categoria});
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro ao listar postagens!");
                    res.redirect("/usuario");
                });
            } else {
                req.flash("error_msg", "Esta categoria não existe");
                res.redirect("/usuario");
            }
        }).catch((err) => {
            req.flash("error_msg", "houve um erro interno ao carregar a página desta categoria");
            res.redirect("/usuario");
        });
    });

    //
    // Estabelecimentos
    //

        router.get("/estabelecimentos", eAdmin, (req, res) => {
            Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
                res.render("admin/estabelecimentos", { postagens: postagens });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao listar as postagens");
                res.redirect("/usuario");
            });
        });

        router.get("/estabelecimentos/add", eAdmin, (req, res) => {
            Categoria.find().then((categorias) => {
                res.render("admin/estabelecimentos", {categorias: categorias});
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao carregar o formulário");
                res.redirect("/usuario");
            });
        });

        router.post("/estabelecimentos/nova", eAdmin, (req, res) => {
            var erros = [];

            if (req.body.categoria == "0") {
                erros.push({ texto: "Categoria inválida, registre uma categoria" });
            }
            if (erros.length > 0) {
                res.render("admin/estabelecimentos", { erros: erros });
            } else {
                const novaPostagem = {
                    titulo: req.body.titulo,
                    descricao: req.body.descricao,
                    conteudo: req.body.conteudo,
                    categoria: req.body.categoria,
                    slug: req.body.slug
                };
                new Postagem(novaPostagem).save().then(() => {
                    req.flash("success_msg", "Postagem criada com sucesso!");
                    res.redirect("/usuario/estabelecimentos");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro durante o salvamento da postagem");
                    res.redirect("/usuario/estabelecimentos");
                });
            }
        });

        router.get("/estabelecimentos/edit/:id", eAdmin, (req, res) => {
            Postagem.findOne({ _id: req.params.id }).then((postagem) => {
                Categoria.find().then((categorias) => {
                    res.render("usuario/editestabelecimentos", {categorias: categorias, postagem: postagem});
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro ao listar as categorias");
                    res.redirect("/usuario/estabelecimentos");
                })
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
                res.redirect("/usuario/estabelecimentos");
            });
        });

        router.post("/estabelecimentos/edit", eAdmin, (req, res) => {
            Postagem.findOne({ _id: req.body.id }).then((postagem) => {
                postagem.titulo = req.body.titulo;
                postagem.slug = req.body.slug;
                postagem.descricao = req.body.descricao;
                postagem.conteudo = req.body.conteudo;
                postagem.categoria = req.body.categoria;

                postagem.save().then(() => {
                    req.flash("sucess_msg", "Postagem editada com sucesso!");
                    res.redirect("/usuario/estabelecimentos");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Erro interno");
                    res.redirect("/usuario/estabelecimentos");
                });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao salvar a edição");
                res.redirect("/usuario/estabelecimentos");
            });
        });

        router.post("/postagens/deletar/", eAdmin, (req, res) => {
            Postagem.remove({ _id: req.body.id }).then(() => {
                req.flash("success_msg", "Postagem deletada com sucesso!");
                res.redirect("/usuario/estabelecimentos");
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao deletar a postagem");
                res.redirect("/usuario/estabelecimentos");
            });
        });


    //
    // Login
    //

    router.post("/login", (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/usuario",
            failureRedirect: "/",
            failureFlash: true
        })(req, res, next);
    });

    router.get("/logout", (req, res) => {
        req.logout();
        req.flash('success_msg', "Deslogando com sucesso!");
        res.redirect("/")
    });

module.exports = router;