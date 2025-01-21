const prisma = require("../prisma/prismaClient");

//ver perfil do user
class PerfilController {
  static async getPerfil(req, res) {
    try{
      prisma.usuario.findUnique({
        where: { id: req.usuarioId },
        omit: { password: true },
      });
      if (!usuario){
        return res.status(404).json({
          erro: true,
          mensagem: "Lamentamos, mas o usuário não foi encontrado.",
        });
      }

      return res.status(200).json({
        erro: false,
        mensagem: "User encontrado com sucesso.",
        usuario: usuario
      })
    } catch (error) {
      return res.status(500).json({
        erro: true,
        mensagem: "Erro ao buscar o perfil do usuário."
      });
    }
  }

//atualiza perfil do user
  static async atualizaPerfil(req, res) {
    const { nome, email } = req.body.usuario || {}

    if (!nome || nome.length <3) {
      return res.status(422).json({
        erro: true,
        mensagem: "O nome deve ter pelo menos 3 caracteres."
      });
    }
    if (!email || email.length <7){
      return res.status(422).json({
        erro: true,
        mensagem: "O email deve ter um mínimo de 7 caracteres."
      });
    }
    try{
      const usuarioAtt = prisma.usuario.update({
        where: {
          id: req.usuarioId,
        },
        data: {
          email: email,
          nome: nome,
        },
      });
      return res.status(200).json({
        erro: false,
        mensagem: "O perfil foi atualizado",
        usuario: {
          id: usuarioAtt.id,
          nome: usuarioAtt.nome,
          email: usuarioAtt.email
        }
      });
    } catch (error) {
      return res.status(500).json({
        erro: true,
        mensagem: "Erro ao atualizar o seu perfil: " + error.message
      });
    }
  }
  //buscar usuarios
  static async BuscarUsuarios(req, res) {
    try{
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });
      if (usuarios.length === 0){
        return res.status(404).json({
          erro: true,
          mensagem: "Nenhum usuario foi encontrado.",
        });
      }
      return res.status(200).json({
        erro: false,
        mensagem: "Usuario encontrado com sucesso.",
        usuarios: usuarios,
      });
    }catch (error) {
      return res.status(500).json({
        erro: true,
        mensagem: "Erro ao buscar os usuarios: " + error.message,
      });
    }
  }
}

module.exports = PerfilController;
