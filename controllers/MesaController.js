const prisma = require("../prisma/prismaClient");

class MesaController {
  static async novaMesa(req, res) {
    const { codigo, n_lugares } = req.body;

    if (!codigo || !n_lugares) {
      return res.status(422).json({
        erro: true,
        mensagem: ""
      })
    }











    return res.json({ mensagem: "acessou o cadastro de mesa"})
  }
}

module.exports = MesaController;