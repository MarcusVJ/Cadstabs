const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport")

router.use(express.static('views/images'));

//
// Models
//

    require("../models/Categoria");
    const Categoria = mongoose.model("categorias");
    require('../models/Postagem');
    const Postagem = mongoose.model("postagens");
    require('../models/Estabelecimentos');
    const Estabelecimento = mongoose.model("estabelecimentos");
//    require("../models/Usuario");
//    const Usuario = mongoose.model("usuarios");

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
            Categoria.find().sort({ nome: 'asc' }).then((categorias) => {
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
                    res.redirect("/usuario/categorias");
                    console.log("Categoria salva com sucesso!");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!");
                    res.redirect("/usuario/categorias");
                });
            }
        });

        router.get("/categorias/edit/:id", eAdmin, (req, res) => {
            Categoria.findOne({ _id: req.params.id }).then((categoria) => {
                res.render("admin/editcategorias", { categoria: categoria });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Esta categoria não existe");
                res.redirect("/usuario/categorias");
            });
        });

        router.post("/categorias/edit", eAdmin, (req, res) => {

            Categoria.findOne({ _id: req.body.id }).then((categoria) => {

                categoria.nome = req.body.nome;
                categoria.slug = req.body.slug;

                categoria.save().then(() => {
                    req.flash("success_msg", "Categoria editada com sucesso!");
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
            Estabelecimento.find().populate("categoria").sort({ data: "desc" }).then((estabelecimento) => {
                res.render("admin/estabelecimentos", { estabelecimento: estabelecimento });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao listar as postagens");
                res.redirect("/usuario");
            });
        });

        router.get("/estabelecimentos/add", eAdmin, (req, res) => {
            Categoria.find().then((categorias) => {
                res.render("admin/addestabelecimentos", {categorias: categorias});
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao carregar o formulário.");
                res.redirect("/usuario");
            });
        });

        router.post("/estabelecimentos/nova", eAdmin, (req, res) => {
            var erros = [];

            if(req.body.cnpj.length > 14 || req.body.cnpj.length < 14){
                erros.push({ texto: "Campo CNPJ com quantidade de dígitos errado (Máximo 14)"});
            }


            if (req.body.categoria == "0") {
                erros.push({ texto: "Categoria inválida, registre uma categoria" });
            }
            if (erros.length > 0) {
                res.render("admin/estabelecimentos", { erros: erros });
            } else {
                const novoEstabelecimento = {
                    razaoSocial: req.body.razaoSocial,
                    nomeFantasia: req.body.nomeFantasia,
                    cnpj: req.body.cnpj,
                    email: req.body.email,
                    endereco: req.body.endereco,
                    cidade: req.body.cidade,
                    estado: req.body.estado,
                    telefone: req.body.telefone,
                    categoria: req.body.categoria,
                    agencia: req.body.agencia,
                    conta: req.body.conta
                };
                new Estabelecimento(novoEstabelecimento).save().then(() => {
                    req.flash("success_msg", "Estabelecimento criado com sucesso!");
                    res.redirect("/usuario/estabelecimentos");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Houve um erro durante o salvamento da estabelecimento");
                    res.redirect("/usuario/estabelecimentos");
                });
            }
        });

        router.get("/estabelecimentos/edit/:id", eAdmin, (req, res) => {
            Estabelecimento.findOne({ _id: req.params.id }).then((estabelecimento) => {
                Categoria.find().then((categorias) => {
                    res.render("admin/editestabelecimentos", {categorias: categorias, estabelecimento: estabelecimento});
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

        router.post("/estabelecimentos/ativarstatus", eAdmin, (req, res) => {
            Estabelecimento.findOne({ _id: req.body.id }).then((estabelecimento) => {
                estabelecimento.status = true;

                estabelecimento.save().then(() => {
                    req.flash("sucess_msg", "Estabelecimento ativado com sucesso!");
                    res.redirect("/usuario/estabelecimentos");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Erro interno.");
                    res.redirect("/usuario/estabelecimentos");
                });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao salvar a edição.");
                res.redirect("/usuario/estabelecimentos");
            });
        });

        router.post("/estabelecimentos/inativarstatus", eAdmin, (req, res) => {
            Estabelecimento.findOne({ _id: req.body.id }).then((estabelecimento) => {
                estabelecimento.status = false;

                estabelecimento.save().then(() => {
                    req.flash("sucess_msg", "Estabelecimento ativado com sucesso!");
                    res.redirect("/usuario/estabelecimentos");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Erro interno.");
                    res.redirect("/usuario/estabelecimentos");
                });
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao salvar a edição.");
                res.redirect("/usuario/estabelecimentos");
            });
        });

        router.post("/estabelecimentos/edit", eAdmin, (req, res) => {
            Estabelecimento.findOne({ _id: req.body.id }).then((estabelecimento) => {
                estabelecimento.razaoSocial = req.body.razaoSocial;
                estabelecimento.nomeFantasia = req.body.nomeFantasia;
                estabelecimento.cnpj = req.body.cnpj;
                estabelecimento.email = req.body.email;
                estabelecimento.endereco = req.body.endereco;
                estabelecimento.cidade = req.body.cidade;
                estabelecimento.estado = req.body.estado;
                estabelecimento.telefone = req.body.telefone;
                estabelecimento.categoria = req.body.categoria;
                estabelecimento.agencia = req.body.agencia;
                estabelecimento.conta = req.body.conta;

                estabelecimento.save().then(() => {
                    req.flash("sucess_msg", "Estabelecimento editado com sucesso!");
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

        router.post("/estabelecimentos/deletar/", eAdmin, (req, res) => {
            Postagem.remove({ _id: req.body.id }).then(() => {
                req.flash("success_msg", "Estabelecimento deletada com sucesso!");
                res.redirect("/usuario/estabelecimentos");
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Houve um erro ao deletar o estabelecimento.");
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
        req.flash('success_msg', "Deslogado com sucesso!");
        res.redirect("/")
    });

module.exports = router;