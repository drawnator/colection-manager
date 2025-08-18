import  sequelize from "../src/config/database";

import { User } from "../src/models/User";
import { Collection } from "../src/models/Collection";

import { UserRepository } from "../src/repository/userRepository";
import { CardRepository } from "../src/repository/cardRepository";
import { BulkRepository } from "../src/repository/bulkRepository";
import { DeckRepository } from "../src/repository/deckRepository";
import { CollectionRepository } from "../src/repository/collectionRepository";


import { CollectionService } from "../src/services/collectionService";
import { UserService } from "../src/services/userService";
import { CardService } from "../src/services/cardService";
import { BulkService } from "../src/services/bulkService"
import { Card, Modifier } from "../src/models/Card";
import { Bulk } from "../src/models/Bulk";

// usar https://pokemontcg.guru/
describe("criação de bulk",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;

    let bulkService: BulkService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        const cardService = new CardService(cardRepository);
        bulkService = new BulkService(bulkRepository);

        await sequelize.sync({ force: true });

        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        const collectionData2 = {
            id:"COL2",
            family:"a & b",
            name:"Coleção 2",
            total:0};
        collection1 = await collectionService.create(collectionData);
        collection2 = await collectionService.create(collectionData2);

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

        const cardData1 = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        const cardData2 = {
            ownerId:user2.id,
            collectionCode:collection2.id,
            number:1,
            modifier:Modifier.holo};
        card1 = await cardService.create(cardData1);
        card2 = await cardService.create(cardData2);

    });

    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("dados completos simples",async () =>{
        const bulkData = {
            ownerId:user1.id,
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        const createdBulk = await bulkService.create(bulkData);
        expect(createdBulk).toHaveProperty("id");
        expect(createdBulk.ownerId).toBe(bulkData.ownerId);
        expect(createdBulk.name).toBe(bulkData.name);
        expect(createdBulk.description).toBe(bulkData.description);
    });
    
    it("sem ownerID",async () =>{
        const bulkData = {
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        await expect(bulkService.create(bulkData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("ownerID invalido",async () =>{
        const bulkData = {
            ownerId: 999,
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        await expect(bulkService.create(bulkData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("com id",async () =>{
        const bulkData = {
            id: -1,
            ownerId: user1.id,
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        const createdBulk = await bulkService.create(bulkData);
        expect(createdBulk).toHaveProperty("id");
        expect(createdBulk.id).not.toBe(bulkData.id);
        expect(createdBulk.id).toBe(bulkData.ownerId);
        expect(createdBulk.name).toBe(bulkData.name);
        expect(createdBulk.description).toBe(bulkData.description);
    });

    it("sem name",async () =>{
        const bulkData = {
            ownerId: 999,
            description:"descrição do bulk",
        };
        await expect(bulkService.create(bulkData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("sem descrição",async () =>{
        const bulkData = {
            ownerId: 999,
            name:"nome do bulk",
        };
        const createdBulk = await bulkService.create(bulkData);
        expect(createdBulk).toHaveProperty("id");
        expect(createdBulk.id).toBe(bulkData.ownerId);
        expect(createdBulk.name).toBe(bulkData.name);
        expect(createdBulk.description).toBeNull();
    });

})

// describe("interação de cartas com o bulk",() =>{})

describe("busca de bulk",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;
    let bulk1: Bulk;
    let bulk2: Bulk;

    let bulkService: BulkService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        const cardService = new CardService(cardRepository);
        bulkService = new BulkService(bulkRepository);

        await sequelize.sync({ force: true });

        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        const collectionData2 = {
            id:"COL2",
            family:"a & b",
            name:"Coleção 2",
            total:0};
        collection1 = await collectionService.create(collectionData);
        collection2 = await collectionService.create(collectionData2);

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

        const cardData1 = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        const cardData2 = {
            ownerId:user2.id,
            collectionCode:collection2.id,
            number:1,
            modifier:Modifier.holo};
        card1 = await cardService.create(cardData1);
        card2 = await cardService.create(cardData2);

        const bulkData1 = {
            ownerId: user1.id,
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        const bulkData2 = {
            ownerId: user1.id,
            name:"outro nome do bulk",
            description:"outra descrição do bulk",
        };
        bulk1 = await bulkService.create(bulkData1);
        bulk2 = await bulkService.create(bulkData2);

    });

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("Id válido",async () =>{
        const bulk = await bulkService.get(bulk1.id);
        expect(bulk).toHaveProperty("id");
        expect(bulk.id).toBe(bulk1.ownerId);
        expect(bulk.ownerId).toBe(bulk1.ownerId);
        expect(bulk.name).toBe(bulk1.name);
        expect(bulk.description).toBe(bulk1.description);

    });

    it("id int",async () =>{
        await expect(bulkService.get(999)).rejects.toThrow("bulk não encontrada")
    });

    it("id string",async () =>{
        await expect(bulkService.get("errado" as any)).rejects.toThrow("Id deve ser um inteiro")
    });

    it("id classe",async () =>{
        await expect(bulkService.get({} as any)).rejects.toThrow("Id deve ser um inteiro")
    });
})

describe("atualização de bulk",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;
    let bulk1: Bulk;
    let bulk2: Bulk;

    let bulkService: BulkService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        const cardService = new CardService(cardRepository);
        bulkService = new BulkService(bulkRepository);

        await sequelize.sync({ force: true });

        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        const collectionData2 = {
            id:"COL2",
            family:"a & b",
            name:"Coleção 2",
            total:0};
        collection1 = await collectionService.create(collectionData);
        collection2 = await collectionService.create(collectionData2);

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

        const cardData1 = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        const cardData2 = {
            ownerId:user2.id,
            collectionCode:collection2.id,
            number:1,
            modifier:Modifier.holo};
        card1 = await cardService.create(cardData1);
        card2 = await cardService.create(cardData2);

        const bulkData1 = {
            ownerId: user1.id,
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        const bulkData2 = {
            ownerId: user1.id,
            name:"outro nome do bulk",
            description:"outra descrição do bulk",
        };
        bulk1 = await bulkService.create(bulkData1);
        bulk2 = await bulkService.create(bulkData2);

    });

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("novo nome",async () =>{
        const bulkData = {
            name:"modificado nome do bulk",
        };
        const updated = await bulkService.update(bulk1.id,bulkData);
        expect(updated[0]).toBe(1);
        const afterUpdate = await bulkService.get(card1.id);
        expect(afterUpdate.name).toBe(bulkData.name);
    });

    it("novo name como int",async () =>{
        const bulkData = {
            name:1 as any
        };
        await expect(bulkService.update(bulk1.id,bulkData)).rejects.toThrow("nome deve ser uma string");
    });

    it("novo nome como id invalido",async () =>{
        const bulkData = {
            name:"modificado nome do bulk",
        };
        await expect(bulkService.update(9999,bulkData)).rejects.toThrow("Bulk não encontrado");
    });

    it("nova descrição",async () =>{
        const bulkData = {
            description:"modificada descrição do bulk",
        };
        const updated = await bulkService.update(bulk1.id,bulkData);
        expect(updated[0]).toBe(1);
        const afterUpdate = await bulkService.get(bulk1.id);
        expect(afterUpdate.description).toBe(bulkData.description);
    });

    it("com múltiplos valores",async () =>{
        const bulkData = {
            name:"modificado nome do bulk",
            description:"modificada descrição do bulk",
        };
        const updated = await bulkService.update(bulk1.id,bulkData);
        expect(updated[0]).toBe(1);
        const afterUpdate = await bulkService.get(bulk1.id);
        expect(afterUpdate.description).toBe(bulkData.description);
        expect(afterUpdate.name).toBe(bulkData.name);
    });

    it("atualização de atributo proibido",async () =>{
        const bulkData = {
            ownerID:2
        };
        await expect(bulkService.update(bulk1.id,bulkData)).rejects.toThrow("Atributo não pode ser modificado");
    });
})

describe("apagar bulk",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;
    let bulk1: Bulk;
    let bulk2: Bulk;

    let bulkService: BulkService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        const cardService = new CardService(cardRepository);
        bulkService = new BulkService(bulkRepository);

        await sequelize.sync({ force: true });

        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        const collectionData2 = {
            id:"COL2",
            family:"a & b",
            name:"Coleção 2",
            total:0};
        collection1 = await collectionService.create(collectionData);
        collection2 = await collectionService.create(collectionData2);

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

        const cardData1 = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        const cardData2 = {
            ownerId:user2.id,
            collectionCode:collection2.id,
            number:1,
            modifier:Modifier.holo};
        card1 = await cardService.create(cardData1);
        card2 = await cardService.create(cardData2);

        const bulkData1 = {
            ownerId: user1.id,
            name:"nome do bulk",
            description:"descrição do bulk",
        };
        const bulkData2 = {
            ownerId: user1.id,
            name:"outro nome do bulk",
            description:"outra descrição do bulk",
        };
        bulk1 = await bulkService.create(bulkData1);
        bulk2 = await bulkService.create(bulkData2);

    });


    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("bulk existente",async () =>{
        const deleteId = bulk1.id;
        const deletedBulk = await bulkService.delete(deleteId);
        expect(deletedBulk).toBe(1)
        await expect(bulkService.get(deleteId)).rejects.toThrow("Bulk não encontrada")
        await expect(bulkService.delete(deleteId)).rejects.toThrow("Bulk não encontrada")
        
    });

    it("id inexistente",async () =>{
        await expect(bulkService.delete(999)).rejects.toThrow("Bulk não encontrada")
    });

    it("id string",async () =>{
        await expect(bulkService.delete("errado" as any)).rejects.toThrow("Id deve ser um inteiro")
    });

    it("id de classe",async () =>{
        await expect(bulkService.delete({} as any)).rejects.toThrow("Id deve ser um inteiro")
    });
})