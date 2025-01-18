const express = require("express");
const router = express.Router();

const MesaController = require("../controllers/MesaController");

router.post("/login", AuthController.login );
router.post("/cadastro", AuthController.cadastro );

router.popst("/", MesaController.novamesa)

module.exports = router;
