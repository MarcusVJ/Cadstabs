const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Estabelecimento = new Schema({
    razaoSocial: {
        type: String,
        required: true
    },
    nomeFantasia: {
        type: String,
        required: true
    },
    cnpj: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    telefone: {
        type: Number,
        required: true
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
        required: true
    },
    conta: {
        type: Number,
        required: true
    }
});

mongoose.model("estabelecimentos", Estabelecimento)