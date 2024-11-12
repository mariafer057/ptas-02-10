const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
                password: hashPassword,
                tipo: "cliente",
            },
        });

        console.log(JSON.stringify(usuario));
        
        const token = jwt.sign({id: usuario.id}, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        return res.json({
            erro: false,
            mensagem: "user cadastrado com sucesso!",
            token: token

        });

    } catch (error){
        return res.json({
            erro: true,
            mensagem: "Ocorreu um erro, tente novamente mais tarde!" + error,
        });
    }
    

    }

    static async login(req, res){
        const {email, password} = req.body

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });

        if(!usuario){
            return res.json({
                erro: true,
                mensagem: "User não encontrado",
            });
        }

        //verificar senha
        const senhaCorreta = bcryptjs.compareSync(password, usuario.password);

        if(!senhaCorreta){
            return res.json({
                erro: true,
                mensagem: "Senha incorreta.",
            });

            const token = jwt.sign({id: usuario.id}, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });
            res.json({
                erro: false,
                mensagem: "Autenticação realizada com sucesso!",
                token: token,
            });
        }
    }
}
module.exports = AuthController;