const prisma = require("../prisma/prismaClient");

class MesaController {
  // Função para criar uma nova mesa
  static async novaMesa(req, res) {
    const { codigo, n_lugares } = req.body;

    // Validação do código da mesa
    if (!codigo || codigo.length < 1) {
      return res.status(422).json({
        erro: true,
        mensagem: "O código fornecido deve ter pelo menos 1 caractere.",
      });
    }

    // Validação do número de lugares
    if (!n_lugares || isNaN(n_lugares) || parseInt(n_lugares) <= 0) {
      return res.status(422).json({
        erro: true,
        mensagem: "O número de lugares deve ser um número válido maior que 0.",
      });
    }

    // Verificação se a mesa já existe
    const mesaJaExiste = await prisma.mesa.count({
      where: {
        codigo: codigo,
      },
    });

    if (mesaJaExiste !== 0) {
      return res.status(422).json({
        erro: true,
        mensagem: "Já existe uma mesa cadastrada com esse código.",
      });
    }

    // Criação da nova mesa
    try {
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
    } catch (error) {
      return res.status(500).json({
        erro: true,
        mensagem: "Houve um erro ao cadastrar a mesa.",
        detalhes: error.message,
      });
    }
  }

  // Listar todas as mesas cadastradas
  static async listarMesas(req, res) {
    try {
      const listaMesas = await prisma.mesa.findMany();
      return res.status(200).json({
        erro: false,
        mensagem: "Mesas recuperadas com sucesso!",
        mesas: listaMesas,
      });
    } catch (erro) {
      return res.status(500).json({
        erro: true,
        mensagem: "Não foi possível buscar as mesas no momento.",
        detalhes: erro.message,
      });
    }
  }

  // Verificar a disponibilidade das mesas em uma data específica
  static async verificarDisponibilidade(req, res) {
    const { dataConsulta } = req.query;

    // Validação da data fornecida
    if (!dataConsulta) {
      return res.status(400).json({
        erro: true,
        mensagem: "Por favor, forneça uma data válida no formato 'aaaa-mm-dd'.",
      });
    }

    // Buscar mesas e reservas
    try {
      const mesasDisponiveis = await prisma.mesa.findMany({
        include: {
          reservas: {
            where: {
              data: new Date(dataConsulta),
            },
          },
        },
      });

      return res.status(200).json({
        erro: false,
        mensagem: "Consulta realizada com sucesso!",
        mesas: mesasDisponiveis,
      });
    } catch (erro) {
      return res.status(500).json({
        erro: true,
        mensagem: "Erro ao verificar a disponibilidade das mesas.",
        detalhes: erro.message,
      });
    }
  }
}

module.exports = MesaController;
