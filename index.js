const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");

const app = express()
app.use(express.json());

//responde a qualquer req encaminhada para
const authRoutes = require("./routes/authRoutes")
app.use("/auth", authRoutes);

app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000");
});