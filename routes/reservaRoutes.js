const express = require("express");
const router = express.Router();

const ReservaController = require("../controllers/ReservaController");
const AuthController = require("../controllers/AuthController");

router.post("/novo", ReservaController.registraReserva);

//Rota para buscar reserva por data
router.get("/data", ReservaController.buscarReservasPorData);

//Rota para excluir reserva
router.delete("/cancelar", ReservaController.excluirReserva);

//Rota para buscar reservas do úsuario
router.get("/minhas", ReservaController.consultarReservasUsuario);

router.get("/verReservas",
    AuthController.verificaAutenticacao,
    AuthController.verificaPermissaoAdm,
    ReservaController.buscarReservasPorData
);

module.exports = router;
