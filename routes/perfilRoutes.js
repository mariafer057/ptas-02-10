const express = require("express");
const router = express.Router();

const perfilController = require("../controllers/PerfilController");

router.get("/", perfilController.getPerfil );
router.put("/", perfilController.atualizaPerfil );


module.exports = router;
