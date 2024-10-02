const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main(){
    //Insere um usuario

   const novoUsuario = await prisma.usuario.create({
    data:{
        nome: "Jão",
        email: "jão.victor@eventim.com",
    },
    });

   console.log("novo usuário: " + JSON.stringify (novoUsuario));
    //busca usuarios
    const usuarios = await prisma.usuario.findMany();
    console.log("todos os users:" + JSON.stringify (usuarios));
}
main().catch((erro) =>{
    console.log("Erro" + erro);
});
