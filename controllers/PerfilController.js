const prisma = require("../prisma/prismaClient");

class PerfilController {
  static async getPerfil(req, res) {
    prisma.usuario.findUnique({
      where: { id: req.usuarioId },
      omit: { password: true },
    });
  }

  static async atualizaPerfil(req, res) {}
}

module.exports = PerfilController;
