const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const bcryptjs = require("bcryptjs");

class AuthController{

    static async cadastro(req, res){
        const { nome, email, password, tipo } = req.body;

        if(!nome || nome.lenght < 6){
            return res.json({
                erro: true,
                mensagem: "O nome deve ter pelo menos 6 caracteres."
            });
        }

        if(!email || email.lenght < 10){
            return res.json({
                erro: true,
                mensagem: "O email deve ter pelo menos 10 caracteres."
            });
        }

        if(!password || password.lenght < 10){
            return res.json({
                erro: true,
                mensagem: "O password deve ter pelo menos 8 caracteres."
            });
        }

        const existe = await prisma.usuario.count({
            where: {
                email: email,
            },
        });


        if (existe != 0) {
            return res.json({
                erro: true,
                mensagem: "Já existe um user com esse email",
            });
        }


        const salt = bcryptjs.genSaltSync(123);
        const hashPassword = bcryptjs.hashSync(password, salt);


        try{
        
      
       const usuario = await prisma.usuario.create({
            data: {
                nome: nome,
                email: email,
                password: password,
                tipo: "cliente",
            },
        });
        return res.json({
            erro: false,
            mensagem: "user cadastrado com sucesso!",
            token:"blabla"

        });

    } catch (error){
        return res.json({
            erro: true,
            mensagem: "Ocorreu um erro, tente novamente mais tarde!" + error,
        });
    }
    

    }

    static async login(req, res){
        
    }
}
module.exports = AuthController;