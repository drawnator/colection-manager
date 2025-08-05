import * as express from "express";
import * as dotenv from "dotenv";
import  sequelize from "./config/database";
// import userRoutes  from "./routes/userRoutes";
import { Router } from "express";
import { authenticateJWT } from "./middlewares/authMiddleware";
import { CardController } from "./controllers/cardController";
import { BulkController } from "./controllers/bulkController";
import { DeckController } from "./controllers/deckController";
import { CollectionController } from "./controllers/collectionController";
import { UserController } from "./controllers/userController";
import { UserRepository } from "./repository/userRepository";
import { CardRepository } from "./repository/cardRepository";
import { BulkRepository } from "./repository/bulkRepository";
import { DeckRepository } from "./repository/deckRepository";
import { CollectionRepository } from "./repository/collectionRepository";
import { CardService } from "./services/cardService";
import { BulkService } from "./services/bulkService";
import { DeckService } from "./services/deckService";
import { CollectionService } from "./services/collectionService";
import { UserService } from "./services/userService";

dotenv.config();

const app = express();
app.use(express.json());

const cardRepository = new CardRepository();
const bulkRepository = new BulkRepository();
const deckRepository = new DeckRepository();
const collectionRepository = new CollectionRepository();
const userRepository = new UserRepository();

const cardService = new CardService(cardRepository);
const bulkService = new BulkService(bulkRepository);
const deckService = new DeckService(deckRepository);
const collectionService = new CollectionService(collectionRepository);
const userService = new UserService(userRepository,bulkRepository);

const cardController = new CardController(cardService);
const bulkController = new BulkController(bulkService,cardService);
const deckController = new DeckController(deckService,cardService);
const collectionController = new CollectionController(collectionService);
const userController = new UserController(userService);

const userRoutes = Router();

app.use("/users", userRoutes);

userRoutes.post("/", async (req, res) => {await userController.createUser(req,res);});

userRoutes.post("/login",async (req,res)=> {await userController.login(req,res);});

// app.get("/users", async (req, res) => {await userController.getAllUsers(req,res);});

userRoutes.get("/", async (req, res) => {await userController.getUser(req,res);});

userRoutes.get("/bulks",async (req, res) => {await bulkController.getUserBulks(req,res);});

userRoutes.patch("/",authenticateJWT, async (req, res) => {await userController.update(req,res);});

userRoutes.delete("/",authenticateJWT,  async (req, res) => {await userController.deleteUser(req,res);});

app.post("/cards",authenticateJWT, async (req,res) => {await cardController.create(req,res);});

app.get("/cards", async (req,res) => {await cardController.get(req,res);});

app.patch("/cards",authenticateJWT, async (req,res) => {await cardController.update(req,res);});

app.delete("/cards",authenticateJWT, async (req,res) => {await cardController.delete(req,res);});

app.post("/bulks",authenticateJWT, async (req,res) => {await bulkController.create(req,res);});

app.get("/bulks", async (req,res) => {await bulkController.get(req,res);});

app.patch("/bulks",authenticateJWT, async (req,res) => {await bulkController.update(req,res);});

app.delete("/bulks",authenticateJWT, async (req,res) => {await bulkController.delete(req,res);});

app.post("/bulks/cards",authenticateJWT, async (req,res) => {await bulkController.add_card(req,res);});

app.delete("/bulks/cards",authenticateJWT, async (req,res) => {await bulkController.remove_card(req,res);});

app.get("/bulks/cards", async (req,res) => {await bulkController.get_cards(req,res);});

app.post("/decks",authenticateJWT, async (req,res) => {await deckController.create(req,res);});

app.get("/decks", async (req,res) => {await deckController.get(req,res);});

app.patch("/decks",authenticateJWT, async (req,res) => {await deckController.update(req,res);});

app.delete("/decks",authenticateJWT, async (req,res) => {await deckController.delete(req,res);});

app.post("/decks/cards",authenticateJWT, async (req,res) => {await deckController.add_card(req,res);});

app.delete("/decks/cards",authenticateJWT, async (req,res) => {await deckController.remove_card(req,res);});

app.get("/decks/cards", async (req,res) => {await deckController.get_cards(req,res);});

app.post("/collections", async (req,res) => {await collectionController.create(req,res);});

app.get("/collections/:id", async (req,res) => {await collectionController.get(req,res);});

app.patch("/collections/:id", async (req,res) => {await collectionController.update(req,res);});

app.delete("/collections/:id", async (req,res) => {await collectionController.delete(req,res);});

// Testando a conexão e inicializando o servidor
// force true apaga o banco
sequelize.sync({ force: true }).then(() => {
  console.log("Banco de dados conectado!");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});
