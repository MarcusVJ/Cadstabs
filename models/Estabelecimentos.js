const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Estabelecimento = new Schema({
    razaoSocial: {
        type: String,
        required: true
    },
    nomeFantasia: {
        type: String,
    },
    cnpj: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    endereco: {
        type: String,
    },
    cidade: {
        type: String,
    },
    estado: {
        type: String,
    },
    telefone: {
        type: Number,
    },
    dataCadastro: {
        type: Date,
        default: Date.now()
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    agencia: {
        type: Number,
    },
    conta: {
        type: Number,
    }
});

mongoose.model("estabelecimentos", Estabelecimento)