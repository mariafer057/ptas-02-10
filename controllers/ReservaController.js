const prisma = require("../prisma/prismaClient");
const { connect } = require("../routes/authRoutes");


class ReservaController{

    static async registraReserva(req, res){
        const {mesaId, n_pessoas } = req.body;
        const data = new Date(req.body.data);
 
        const mesa = await prisma.mesa.findUnique({
            where: {id: mesaId},
            include: {
                reservas: {
                   where: {
                    data: data,
                    status: true,
                   },
                },
            },

        });

        //Vericar se a data da reserva é >= hoje

        //verficar se a mesa consegue comportar o num de pessoas indicado

        //verificar se a mesa esta livre para a data selecionada
        
        if(mesa.reservas.length > 0){
            return res.status(400).json({
                erro: true,
                mensagem: "A mesa selecionada ja esta reservada para essa data"
            });
        }

        prisma.reserva.create({
            data: {
                data: data,
                n_pessoas: n_pessoas,
                usuario: {
                    connect: {
                        id: req.usuarioId,     
                    },
                },
                mesa: {
                    connect: {
                        id: mesaId,
                    },
                },
            },
        }).then(()=>{
            return res.status(201).json({
                erro: false, 
                mensagem: "Reserva realizada com sucesso",
            });
        })
        .catch((err)=>{
            return res.status(201).json({
                erro: true, 
                mensagem: "Ocorreu um erro ao cadastrar reserva",
        });
    });
  }
}

module.exports = ReservaController;
