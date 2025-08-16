
import  sequelize from "../src/config/database";

// import { CardController } from "../src/controllers/cardController";
// import { BulkController } from "../src/controllers/bulkController";
// import { DeckController } from "../src/controllers/deckController";
// import { CollectionController } from "../src/controllers/collectionController";
// import { UserController } from "../src/controllers/userController";

// import { CardService } from "../src/services/cardService";
// import { BulkService } from "../src/services/bulkService";
// import { DeckService } from "../src/services/deckService";
// import { CollectionService } from "../src/services/collectionService";
import { UserService } from "../src/services/userService";

import { UserRepository } from "../src/repository/userRepository";
import { CardRepository } from "../src/repository/cardRepository";
import { BulkRepository } from "../src/repository/bulkRepository";
import { DeckRepository } from "../src/repository/deckRepository";
import { CollectionRepository } from "../src/repository/collectionRepository";

describe("Criação de Usuário", () => {
    let userService: UserService;

    beforeEach(async () => {
        
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        userService = new UserService(userRepository,bulkRepository);

        //TODO use test database instead of default
        await sequelize.sync({ force: true }).then(() => console.log("Database synced for testing"));
    });
    afterEach(()=>{
        sequelize.dropAllSchemas({})
    })
    // Sucesso
    it("nome, senha e email simples", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com" };
        const createdUser = await userService.createUserCrypt(userData);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.isActive).toBe(true);
    });

    it("nome com unicode", async () => {
        const userData = { name: "Usuário Teste",
                        password: "$Password123",
                        email:"testemail@email.com" };
        const createdUser = await userService.createUserCrypt(userData);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.isActive).toBe(true);
    });

    it("senha com unicode", async () => {
        const userData = { name: "userTest",
                        password: "$Pássword123.;.;DROP TABLE users;--",
                        email:"testemail@email.com" };
        const createdUser = await userService.createUserCrypt(userData);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.isActive).toBe(true);
    });
    
    // email inválidos
    it("Email repetido", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com" };
        await userService.createUserCrypt(userData);
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("Email já está em uso.");
    });
    it("Email sem @", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemailemail.com" };
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("Email não tem o formato correto.");
    });

    it("Email com espaço", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemail email.com" };
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("Email não tem o formato correto.");
    });

    // Senhas inválidas
    it("Senha pequena", async () => {
        const userData = { name: "userTest",
                        password: "123",
                        email:"testemail@email.com" };
        await expect(userService.createUserCrypt(userData)).rejects.toThrow ;
    });

    it("Senha sem números", async () => {
        const userData = { name: "userTest",
                        password: "$Password",
                        email:"testemail@email.com" };
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("A senha deve ter pelo menos um número.");
    });
    
    it("Senha sem letra maiúscula", async () => {
        const userData = { name: "userTest",
                        password: "$password123",
                        email:"testemail@email.com" };
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("A senha deve ter pelo menos uma letra maiúscula.");
    });

    it("Senha sem caracteres especiais", async () => {
        const userData = { name: "userTest",
                        password: "Password123",
                        email:"testemail@email.com" };
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("A senha deve ter pelo menos uma letra caractere especial.");
    });

    // entradas inválidas
    it("Email faltando", async () => {
        const userData = { name: "userTest",
                        password: "$password123",};
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("Todos os campos são obrigatórios.");
    });

    it("Senha faltando", async () => {
        const userData = { name: "userTest",
                        email:"testemail@email.com"};
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("Todos os campos são obrigatórios.");
    });

    it("Nome faltando", async () => {
        const userData = { email:"testemail@email.com",
                        password: "$password123",};
        await expect(userService.createUserCrypt(userData)).rejects.toThrow("Todos os campos são obrigatórios.");
    });

    it("atributos a mais", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com",
                        extraField: "extraValue",
                        otherField: "otherValue"};
        const createdUser = await userService.createUserCrypt(userData);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser).not.toHaveProperty("extraField");
        expect(createdUser).not.toHaveProperty("otherField");
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.isActive).toBe(true);
    });

    it("atributos id adicionado", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com",
                        id: -1,};
        const createdUser = await userService.createUserCrypt(userData);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser.id).toBeGreaterThan(0);
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.isActive).toBe(true);
    });
    
    it("atributos isActive adicionado", async () => {
        const userData = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com",
                        isActive: false};
        const createdUser = await userService.createUserCrypt(userData);
        expect(createdUser).toHaveProperty("id");
        expect(createdUser.isActive).toBe(false);
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.isActive).toBe(true);
    });
})