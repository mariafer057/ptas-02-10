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

    //Função para encontrar reservas por data
    static async buscarReservasPorData(req, res){
        const {data} = req.query;

        if(!data){
            return res.status(400).json({
                sucesso: false,
                mensagem: "Por favor, forneça uma data no formato 'yyyy-mm-dd'.",
            })
        }
         try{
            const reservasPorData = await prisma.reserva.findMany({
                where; {
                    data: new Date (data),
                },
                include: {
                    mesa: true,
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                        },
                    },
                },
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: "Reservas para a data selecionada encontradas com sucesso.",
                reservasPorData
            });

        } catch (err){
            console.error(err)
            return res.status(500).json({
                sucesso: true,
                mensagem: "Falha ao buscar as reservas para a data fornecida.",
            });
        }
    }

    // Função para excluir uma reserva
    static async excluirReserva(req, res){
        const {reservaId} = req.body;
        try{
            const reserva = await prisma.reserva.findUnique({
                where: {id: parseInt(reservaId)},
            });

        if (!reserva){
            return res.status(404).json({
                sucesso: false,
                mensagem: "Reserva não localizada, por favor verificar o ID fornecido.",
            });
        }
        
        if (reserva.usuario !== req.usuarioId){
            return res.status(403).json({
                sucesso: false,
                mensagem: "Você não tem autorização para cancelar essa reserva",
            });
        }

        await prisma.reserva.delete({
            where: {id: pardeInt(reservaId)},
        });

        return res.status(200).json({
            sucesso: true,
            mensagem: "Reserva cancelada com sucesso.",
            });

        } catch (err){
            console.error(err)
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao cancelar reserva.",
            });
        }
    }

    //FUnção para consultar as reservas do úsuario
    static async consultarReservasUsuario(req, res){
    try{
            const reservasUsuario = await prisma.reserva.findUnique({
                where: {
                    usuarioId: req.usuarioId,
                },
                include: {
                    mesa: true,
                },
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: "Suas reservas foram recuperadas com sucesso.",
                reservasUsuario
                });
    
            } catch (err){
                console.error(err)
                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Falha ao tentar recuperar suas reservas.",
                });
            }

         
}

module.exports = ReservaController;
