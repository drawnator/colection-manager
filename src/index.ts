import * as express from "express";
import * as dotenv from "dotenv";
import  sequelize from "./config/database";
import { UserController } from "./controllers/userController";
import { CardController } from "./controllers/cardController";
import { BulkController } from "./controllers/bulkController";
import { DeckController } from "./controllers/deckController";
import { CollectionController } from "./controllers/collectionController";

dotenv.config();

const app = express();
app.use(express.json());

const userController = new UserController();
const cardController = new CardController();
const bulkController = new BulkController();
const deckController = new DeckController();
const collectionController = new CollectionController();

app.post("/users", async (req, res) => {await userController.createUser(req,res);});

app.get("/users", async (req, res) => {await userController.getAllUsers(req,res);});

app.post("/cards", async (req,res) => {await cardController.create(req,res);});

app.get("/cards", async (req,res) => {await cardController.get(req,res);});

app.patch("/cards", async (req,res) => {await cardController.update(req,res);});

app.delete("/cards", async (req,res) => {await cardController.delete(req,res);});

app.post("/bulks", async (req,res) => {await bulkController.create(req,res);});

app.get("/bulks", async (req,res) => {await bulkController.get(req,res);});

app.patch("/bulks", async (req,res) => {await bulkController.update(req,res);});

app.delete("/bulks", async (req,res) => {await bulkController.delete(req,res);});

app.post("/decks", async (req,res) => {await deckController.create(req,res);});

app.get("/decks", async (req,res) => {await deckController.get(req,res);});

app.patch("/decks", async (req,res) => {await deckController.update(req,res);});

app.delete("/decks", async (req,res) => {await deckController.delete(req,res);});

app.post("/collections", async (req,res) => {await collectionController.create(req,res);});

app.get("/collections", async (req,res) => {await collectionController.get(req,res);});

app.patch("/collections", async (req,res) => {await collectionController.update(req,res);});

app.delete("/collections", async (req,res) => {await collectionController.delete(req,res);});

// Testando a conexão e inicializando o servidor
// force true apaga o banco
sequelize.sync({ force: true }).then(() => {
  console.log("Banco de dados conectado!");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});
