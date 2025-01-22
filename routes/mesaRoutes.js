const express = require("express");
const router = express.Router();

const MesaController = require("../controllers/MesaController");
const AuthController = require("../controllers/AuthController");

//ROta para criar uma nova mesa
router.post("/novo", 
    AuthController.verificaAutenticacao, 
    AuthController.verificaPermissaoAdm,
    MesaController.novaMesa
);

//Rota para buscar todas as mesas
router.get("/", MesaController.buscarMesa);

//Rota para buscar mesas disponíveis
router.get("/disponibilidade",  MesaController.mesasDisp);

module.exports = router;
