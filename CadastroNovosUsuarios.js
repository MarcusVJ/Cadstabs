const readline = require('readline');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const db = require("./config/db");

//
// Mongoose
//

    mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("**** Status -> Conexão MongoDB: [Online]");
    }).catch((err) => {
        console.log("**** Status -> Conexão MongoDB: [Offline] " + err);
        process.exit(22);
    });

//
// Read Line
//

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

//
// Models
//

    require("./models/Usuario");
    const Usuario = mongoose.model("usuarios");

//
// Variáveis
//

    var nome = "";
    var email = "";
    var senha1 = "";
    var senha2 = "";

//
// Script
//

    rl.write("                        +---------------------------------------+\n");
    rl.write("                        + CADASTRO DE NOVOS USUÁRIOS - CADSTABS +\n");
    rl.write("                        +---------------------------------------+\n\n");



    var questionNome = () => {
        return new Promise((resolve, reject) => {
            rl.question('Nome do usuário: ', (answer) => {
                nome = answer;
                resolve();
            });
        });
    };

    const questionEmail = () => {
        return new Promise((resolve, reject) => {
            rl.question('Email de cadastro: ', (answer) => {
                email = answer;
                resolve();
            });
        });
    };

    const questionSenha1 = () => {
        return new Promise((resolve, reject) => {
            rl.question('Senha: ', (answer) => {
                senha1 = answer;
                resolve();
            });
        });
    };

    const questionSenha2 = () => {
        return new Promise((resolve, reject) => {
            rl.question('Repita a senha: ', (answer) => {
                senha2 = answer;
                resolve();
            })
        })
    };

    const main = async () => {
        await questionNome();
        await questionEmail();
        await questionSenha1();
        await questionSenha2();
        console.log("\n\nValores registrados\nNome: " + nome + "\nE-mail: " + email + "\nSenha1: " + senha1 + "\nSenha2: " + senha2)
        verificaCampos();
        console.log("1")

        cadastrarUsuario();
        console.log("2")

        rl.close();
        process.exit(22)
    };

    function verificaCampos(){
        if (!nome || typeof nome == undefined || nome == null || nome == "") {
            console.log("**** Nome inválido! ****");
            process.exit(22);
        }
        if (!email || typeof email == undefined || email == null || email  == "") {
            console.log("**** Email inválido! ****");
            process.exit(22);
        }
        if (!senha1 || typeof senha1 == undefined || senha1 == null || senha1 == "") {
            console.log("**** Senha inválida! ****");
            process.exit(22);
        }
        if (!senha2 || typeof senha2 == undefined || senha2 == null|| senha2 == "") {
            console.log("**** Senha inválida! ****");
            process.exit(22);
        }
        if (senha1.length < 4) {
            console.log("**** Senha muito curta! ****");
            process.exit(22);
        }
        if (senha1 != senha2) {
            console.log("**** Senhas não batem! ****");
            process.exit(22);
        }
    }

    function cadastrarUsuario(){
        Usuario.findOne({ email: email }).then((usuario) => {
            if (usuario) {
                console.log("Esse email ja possui um cadastro no sistema!");
                process.exit(22);
            } else {
                var novoUsuario = new Usuario({
                    nome: nome,
                    email: email,
                    senha: senha1
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            console.log("Houve um erro durante o salvamento do usuário. " + err);
                            process.exit(22);
                        } else {
                            novoUsuario.senha = hash;
                            novoUsuario.save().then(() => {
                                console.log("Usuário cadastrado com sucesso!");
                                process.exit(22);
                            }).catch((err) => {
                                console.log("Houve um erro na criação do usuário. " + err);
                                process.exit(22);
                            });
                        }
                    });
                });
            }
        }).catch((err) => {
            console.log("Houve um erro interno. " + err);
            process.exit(22);
        });
    }

main();


