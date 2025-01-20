const prisma = require("../prisma/prismaClient");
const { connect } = require("../routes/authRoutes");

class ReservaController {
    static async registraReserva(req, res) {
        const { mesaId, n_pessoas } = req.body;
        const dataReserva = new Date(req.body.data);

        try {
            // Verificar se a data da reserva é válida (não pode ser anterior à data atual)
            const dataAtual = new Date();
            if (dataReserva < dataAtual) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "A data da reserva não pode ser anterior à data atual.",
                });
            }

            // Procurar mesa pelo ID e verificar sua disponibilidade
            const mesa = await prisma.mesa.findUnique({
                where: { id: parseInt(mesaId) },
                include: {
                    reservas: {
                        where: {
                            data: dataReserva,
                            status: true,
                        },
                    },
                },
            });

            if (!mesa) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Mesa não encontrada. Verifique o ID fornecido.",
                });
            }

            // Verificar se a mesa tem capacidade suficiente para o número de pessoas
            if (mesa.n_lugares < n_pessoas) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "A mesa não comporta o número de pessoas informado.",
                });
            }

            // Verificar se a mesa está reservada para a data escolhida
            if (mesa.reservas.length > 0) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "A mesa selecionada já está reservada para a data selecionada.",
                });
            }

            // Criar a reserva
            await prisma.reserva.create({
                data: {
                    data: dataReserva,
                    n_pessoas: n_pessoas,
                    usuario: {
                        connect: {
                            id: req.usuarioId,
                        },
                    },
                    mesa: {
                        connect: {
                            id: parseInt(mesaId),
                        },
                    },
                },
            });

            return res.status(201).json({
                erro: false,
                mensagem: "Reserva realizada com sucesso.",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro ao cadastrar a reserva.",
                detalhe: err.message,
            });
        }
    }
}

module.exports = ReservaController;
