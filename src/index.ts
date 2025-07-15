import * as express from "express";
import * as dotenv from "dotenv";
import  sequelize from "./config/database";
import { UserController } from "./controllers/userController";


dotenv.config();

const app = express();
app.use(express.json());

const userController = new UserController();


app.post("/users", async (req, res) => {
  await userController.createUser(req,res);
});


app.get("/users", async (req, res) => {
    await userController.getAllUsers(req,res);
});


// Testando a conexão e inicializando o servidor
// force true apaga o banco
sequelize.sync({ force: true }).then(() => {
  console.log("Banco de dados conectado!");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});
