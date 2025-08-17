
import  sequelize from "../src/config/database";

import { UserService } from "../src/services/userService";

import { UserRepository } from "../src/repository/userRepository";
import { CardRepository } from "../src/repository/cardRepository";
import { BulkRepository } from "../src/repository/bulkRepository";
import { DeckRepository } from "../src/repository/deckRepository";
import { CollectionRepository } from "../src/repository/collectionRepository";
import { User } from "../src/models/User";

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
        await sequelize.sync({ force: true });
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

describe("Busca de Usuário", () => {
    let userService: UserService;
    let user1: User;
    let user2: User;
    let user3: User;

    beforeEach(async () => {
        
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        userService = new UserService(userRepository,bulkRepository);

        //TODO use test database instead of default
        await sequelize.sync({ force: true });
        const user1Data = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com" };
        const user2Data = { name: "userTest2",
                        password: "Password123$",
                        email:"test2email@email.com"};
        const user3Data = { name: "userTest3",
                        password: "Password$123",
                        email:"test3email@email.com"};
        user1 = await userService.createUserCrypt(user1Data);
        user2 = await userService.createUserCrypt(user2Data);
        user3 = await userService.createUserCrypt(user3Data);
        user3.isActive = false;
        await user3.save();
    });
    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("por id", async () => {
        const user = await userService.getUser(1);
        expect(user).toHaveProperty("id");
        expect(user.name).toBe(user1.name);
        expect(user.email).toBe(user1.email);
        expect(user.isActive).toBe(true);
        expect(user.id).toBe(user1.id);
    });

    it("por id inexistente", async () => {
        await expect(userService.getUser(999)).rejects.toThrow("Usuário não encontrado");
    });

    it("por id com id negativo", async () => {
        await expect(userService.getUser(-1)).rejects.toThrow("Usuário não encontrado");
    });

    it("por id com id zero", async () => {
        await expect(userService.getUser(0)).rejects.toThrow("Usuário não encontrado");
    });

    it("por id com id não numérico", async () => {
        await expect(userService.getUser("abc" as any)).rejects.toThrow("Usuário não encontrado");
    });

    it("por id com id decimal", async () => {
        await expect(userService.getUser(1.5 as any)).rejects.toThrow("Usuário não encontrado");
    });

    it("por id com id string", async () => {
        const user = await userService.getUser("1" as any);
        expect(user).toHaveProperty("id");
        expect(user.name).toBe(user1.name);
        expect(user.email).toBe(user1.email);
        expect(user.isActive).toBe(true);
        expect(user.id).toBe(user1.id);
    });

    it("por id com id booleano", async () => {
        await expect(userService.getUser(true as any)).rejects.toThrow("Usuário não encontrado");
    });

    it("por id com id objeto", async () => {
        await expect(userService.getUser({} as any)).rejects.toThrow("Usuário não encontrado");
    });

    it("por todos ativos", async () => {
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(2);
        expect(activeUsers[0].isActive).toBe(true);
        expect(activeUsers[1].isActive).toBe(true);
        expect(activeUsers).not.toContainEqual(expect.objectContaining({ id: user3.id }));
        expect(activeUsers[0].dataValues).not.toHaveProperty("password");
        expect(activeUsers[1].dataValues).not.toHaveProperty("password");
    });

    it("por todos ativos com nenhum ativo", async () => {
        user1.isActive = false;
        user2.isActive = false;
        await user1.save();
        await user2.save();
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(0);
    });

    it("por todos ativos com um só um ativo", async () => {
        user1.isActive = false;
        await user1.save();
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(1);
        expect(activeUsers[0].isActive).toBe(true);
        expect(activeUsers[0].id).toBe(user2.id);
    });

    it("por todos ativos sem usuários", async () => {
        await userService.delete(user1.id);
        await userService.delete(user2.id);
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(0);
    });

});

describe("Autenticação de Usuário", () => {
    let userService: UserService;
    let user1: User;
    let user2: User;

    beforeEach(async () => {
        
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        userService = new UserService(userRepository,bulkRepository);

        //TODO use test database instead of default
        await sequelize.sync({ force: true });
        const user1Data = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com"}
        user1 = await userService.createUserCrypt(user1Data);
        const user2Data = { name: "userTest2",
                        password: "Password123$",
                        email:"test2email@email.com"};
    });

    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("login sucesso", async () => {
        const password = "$Password123";
        const email ="testemail@email.com";
        const {user, token} = await userService.authenticate(email, password);
        expect(user).toHaveProperty("id");
        expect(user.name).toBe(user1.name);
        expect(user.email).toBe(user1.email);
        expect(user.isActive).toBe(true);
        expect(user.id).toBe(user1.id);
        expect(token).toBeDefined();
        expect(token).not.toBe("");
        expect(token).not.toBeNull();

    });

    it("login falha senha errada", async () => {
        const password = "WrongPassword123$";
        const email ="testemail@email.com";
        await expect(userService.authenticate(password, email)).rejects.toThrow("Email ou senha incorretos");
    });

    it("login falha email errado", async () => {
        const password = "$Password123";
        const email ="wrongemail@emai.com";
        await expect(userService.authenticate(email, password)).rejects.toThrow("Email ou senha incorretos");
    });
});

describe("atualização de Usuário", () => {
    let userService: UserService;
    let user1: User;
    let user2: User;
    let user3: User;
        
    beforeEach(async () => {
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        userService = new UserService(userRepository,bulkRepository);

        //TODO use test database instead of default
        await sequelize.sync({ force: true });
        const user1Data = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com" };
        const user2Data = { name: "userTest2",
                        password: "Password123$",
                        email:"test2email@email.com"};
        const user3Data = { name: "userTest3",
                        password: "Password$123",
                        email:"test3email@email.com"};
        user1 = await userService.createUserCrypt(user1Data);
        user2 = await userService.createUserCrypt(user2Data);
        user3 = await userService.createUserCrypt(user3Data);
        user3.isActive = false;
        await user3.save();
        
    });

    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("atualização de nome", async () => {
        const newName = "Novo Nome";
        const updatedUser = await userService.updateCrypt(user1.id, { name: newName });
        expect(updatedUser[0]).toBe(1);
        const user = await userService.getUser(user1.id);
        expect(user.name).toBe(newName);
    });

    it("atualização de email", async () => {
        const newEmail = "testenovo@email.com";
        const updatedUser = await userService.updateCrypt(user1.id, { email: newEmail});
        expect(updatedUser[0]).toBe(1);
        const user = await userService.getUser(user1.id);
        expect(user.email).toBe(newEmail);
    });

    it("atualização de senha", async () => {
        const newPassword = "NovaSenha123$";
        const updatedUser = await userService.updateCrypt(user1.id, { password: newPassword });
        expect(updatedUser[0]).toBe(1);
        const user = await userService.getUser(user1.id);
        expect(user.password).not.toBe(user1.password);
        const {user: authenticatedUser} = await userService.authenticate(user.email, newPassword);
        expect(authenticatedUser.id).toBe(user.id);
    });
});

describe("desativação de Usuário", () => {
    let userService: UserService;
    let user1: User;
    let user2: User;
    let user3: User;
        
    beforeEach(async () => {
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        userService = new UserService(userRepository,bulkRepository);

        //TODO use test database instead of default
        await sequelize.sync({ force: true });
        const user1Data = { name: "userTest",
                        password: "$Password123",
                        email:"testemail@email.com" };
        const user2Data = { name: "userTest2",
                        password: "Password123$",
                        email:"test2email@email.com"};
        const user3Data = { name: "userTest3",
                        password: "Password$123",
                        email:"test3email@email.com"};
        user1 = await userService.createUserCrypt(user1Data);
        user2 = await userService.createUserCrypt(user2Data);
        user3 = await userService.createUserCrypt(user3Data);
        user3.isActive = false;
        await user3.save();
        
    });

    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("usuário ativo", async () => {
        const result = await userService.delete(user1.id);
        expect(result[0]).toBe(1);
        await expect(userService.getUser(user1.id)).rejects.toThrow("Usuário não encontrado");
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(1);
        expect(activeUsers[0].id).toBe(user2.id);
    });

    it("já desativado", async () => {
        await expect(userService.delete(user3.id)).rejects.toThrow("Usuário não encontrado");
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(2);
    });

    it("usuário inexistente", async () => {
        await expect(userService.delete(999)).rejects.toThrow("Usuário não encontrado");
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(2);
    });

    it("com id negativo", async () => {
        await expect(userService.delete(-1)).rejects.toThrow("Usuário não encontrado");
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(2);
    });

    it("com id não numérico", async () => {
        await expect(userService.delete("abc" as any)).rejects.toThrow("Usuário não encontrado");
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(2);
    });

    it("com id decimal", async () => {
        await expect(userService.delete(1.5 as any)).rejects.toThrow("Usuário não encontrado");
        const activeUsers = await userService.getActiveUsers();
        expect(activeUsers).toHaveLength(2);
    });
});