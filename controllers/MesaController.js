const prisma = require("../prisma/prismaClient");

//função de criar a mesa
//função de verificar se a mesa já foi criada
class MesaController {
  static async novaMesa(req, res) {
    const { codigo, n_lugares } = req.body;

    if (!codigo || codigo.length <1) {
      return res.status(422).json({
        erro: true,
        mensagem: "O código fornecido, deve ter pelo menos 1 caractere",
      });
    }
    if (!n_lugares || isNaN(n_lugares) || parseInt(n_lugares) <=0){
      return res.status(422).json({
        erro: true,
        mensagem: "Lembre-se que: O numero de lugares deve ser um número válido e > que 0",
      });
    }
  const mesaJaExiste = await prisma.mesa.count({
    where: {
      codigo: codigo,
    },
  });
  if (mesaJaExiste !== 0){
    return res.status(422).json({
      erro: true,
      mensagem: "Sinto muito. Já existe uma mesa cadastrada com esse código.",
    })
  }
    try{
      await prisma.mesa.create({
        data: {
          codigo,
          n_lugares: parseInt(n_lugares),
        },
      });
      return res.status(201).json({
        erro: false,
        mensagem: "Mesa cadastrada com sucesso!",
      });
    }catch(error){
      return res.status(500).json({
      erro: true,
      mensagem: "Lamentamos. Houve um erro ao cadastrar mesa.",
    });
  }









    return res.json({ mensagem: "acessou o cadastro de mesa"})
  }
}

module.exports = MesaController;