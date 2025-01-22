const express = require("express");
const router = express.Router();

const perfilController = require("../controllers/PerfilController");
const AuthController = require("../controllers/AuthController");

//Rotas para vizualizar o perfil do úsuario e atualizar
router.get("/", perfilController.getPerfil );
router.put("/", perfilController.atualizaPerfil );
router.get("/todos",
    AuthController.verificaAutenticacao,
    AuthController.verificaPermissaoAdm,
    perfilController.BuscarUsuarios
);

module.exports = router;
