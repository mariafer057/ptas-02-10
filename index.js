const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
require('dotenv').config();

const express = require("express");

const app = express()
app.use(express.json());

const cors = require("cors");
app.use(cors());

//responde a qualquer req encaminhada para
const authRoutes = require("./routes/authRoutes")
app.use("/auth", authRoutes);

app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000");
});