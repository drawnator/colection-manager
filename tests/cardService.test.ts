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
import { CardService } from "../src/services/cardService"
import { Card, Modifier } from "../src/models/Card";

// usar https://pokemontcg.guru/
describe("criação de carta",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let cardService: CardService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        cardService = new CardService(cardRepository);

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

    });

    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("dados completos simples",async () =>{
        const cardData = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        const createdCard = await cardService.create(cardData);
        expect(createdCard).toHaveProperty("id");
        expect(createdCard.id).toBe(cardData.ownerId);
        expect(createdCard.collectionCode).toBe(cardData.collectionCode);
        expect(createdCard.number).toBe(cardData.number);
        expect(createdCard.modifier).toBe(cardData.modifier);
    });
    
    it("sem ownerID",async () =>{
        const cardData = {
            // ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        await expect(cardService.create(cardData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("ownerID invalido",async () =>{
        const cardData = {
            ownerId:999,
            collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        await expect(cardService.create(cardData)).rejects.toThrow("usuário não encontrado");
    });

    it("sem collectionCode",async () =>{
        const cardData = {
            ownerId:user1.id,
            // collectionCode:collection1.id,
            number:101,
            modifier:Modifier.Normal};
        await expect(cardService.create(cardData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("collectionCode invalido",async () =>{
        const cardData = {
            ownerId:user1.id,
            collectionCode:"Coleção inexistente",
            number:101,
            modifier:Modifier.Normal};
        await expect(cardService.create(cardData)).rejects.toThrow("coleção não encontrada");
    });

    it("sem numero",async () =>{
        const cardData = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            //number:101,
            modifier:Modifier.Normal};
        await expect(cardService.create(cardData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("numero string não inteiro",async () =>{
        const cardData = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:"101",
            modifier:Modifier.Normal
            };
        await expect(cardService.create(cardData)).rejects.toThrow("Number deve ser um valor numérico");
    });

    it("sem modificador",async () =>{
        const cardData = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            //modifier:Modifier.Normal
            };
        await expect(cardService.create(cardData)).rejects.toThrow("Todos os atributos são obrigatórios");
    });

    it("modificador invalido",async () =>{
        const cardData = {
            ownerId:user1.id,
            collectionCode:collection1.id,
            number:101,
            modifier:"errado"
            };
        await expect(cardService.create(cardData)).rejects.toThrow("modificador deve ser válido");
    });
})

describe("busca de carta",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;

    let cardService: CardService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        cardService = new CardService(cardRepository);

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

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("Id válido",async () =>{
        const card = await cardService.get(card1.id);
        expect(card).toHaveProperty("id");
        expect(card.id).toBe(card1.ownerId);
        expect(card.collectionCode).toBe(card1.collectionCode);
        expect(card.number).toBe(card1.number);
        expect(card.modifier).toBe(card1.modifier);

    });

    it("id invalido",async () =>{
        await expect(cardService.get(999)).rejects.toThrow("Carta não encontrada")
    });

    it("id string",async () =>{
        await expect(cardService.get("errado" as any)).rejects.toThrow("Id deve ser um inteiro")
    });

    it("id classe",async () =>{
        await expect(cardService.get({} as any)).rejects.toThrow("Id deve ser um inteiro")
    });
})

describe("atualização de carta",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;

    let cardService: CardService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        cardService = new CardService(cardRepository);

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

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("novo number",async () =>{
        const cardData = {
            number:999
        };
        const updatedCard = await cardService.update(card1.id,cardData);
        expect(updatedCard[0]).toBe(1);
        const card = await cardService.get(card1.id);
        expect(card.number).toBe(cardData.number);
    });

    it("novo number como string",async () =>{
        const cardData = {
            number:"abc"
        };
        await expect(cardService.update(card1.id,cardData)).rejects.toThrow("Id deve ser um inteiro");
    });

    it("novo number como id invalido",async () =>{
        const cardData = {
            number:999
        };
        await expect(cardService.update(9999,cardData)).rejects.toThrow("Carta não encontrada");
    });

    it("novo modificador",async () =>{
        const cardData = {
            modifier:Modifier.holo
        };
        const updatedCard = await cardService.update(card1.id,cardData);
        expect(updatedCard[0]).toBe(1);
        const card = await cardService.get(card1.id);
        expect(card.modifier).toBe(cardData.modifier);
    });

    it("modificador invalido",async () =>{
        const cardData = {
            modifier:"erro" as any
        };
        await expect(cardService.update(card1.id,cardData)).rejects.toThrow("modificador deve ser válido");
    });

    it("nova coleção",async () =>{
        const cardData = {
            collectionCode:collection2.id
        };
        const updatedCard = await cardService.update(card1.id,cardData);
        expect(updatedCard[0]).toBe(1);
        const card = await cardService.get(card1.id);
        expect(card.modifier).toBe(collection2.id);
    });

    // it("nova coleção",async () =>{
    //     const cardData = {
    //         collectionCode:collection2.id
    //     };
    //     const updatedCard = await cardService.update(card1.id,cardData);
    //     expect(updatedCard[0]).toBe(1);
    //     const card = await cardService.get(card1.id);
    //     expect(card.modifier).toBe(collection2.id);
    // });

    it("coleção invalida",async () =>{
        const cardData = {
            collectionCode:"invalido"
        };
        await expect(cardService.update(card1.id,cardData)).rejects.toThrow("coleção invalida")
        
    });

    it("atualização de múltiplos valores",async () =>{
        const cardData = {
            number:999,
            modifier:Modifier.Reverse
        };
        const updatedCard = await cardService.update(card1.id,cardData);
        expect(updatedCard[0]).toBe(1);
        const card = await cardService.get(card1.id);
        expect(card.number).toBe(cardData.number);
        expect(card.modifier).toBe(cardData.modifier);
    });

    it("atualização de atributo proibido",async () =>{
        const cardData = {
            ownerID:2
        };
        await expect(cardService.update(card1.id,cardData)).rejects.toThrow("Atributo não pode ser modificado");
    });
})

describe("apagar carta",() =>{
    let user1: User;
    let user2: User;
    let user3: User;
    let collection1: Collection;
    let collection2: Collection;
    let card1: Card;
    let card2: Card;

    let cardService: CardService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        const collectionService = new CollectionService(collectionRepository);
        const userService = new UserService(userRepository,bulkRepository);
        cardService = new CardService(cardRepository);

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

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("carta existente",async () =>{
        const deleteId = card1.id;
        const deletedCollection = await cardService.delete(deleteId);
        expect(deletedCollection).toBe(1)
        await expect(cardService.get(deleteId)).rejects.toThrow("Carta não encontrada")
        await expect(cardService.delete(deleteId)).rejects.toThrow("Carta não encontrada")
        
    });

    it("id inexistente",async () =>{
        await expect(cardService.delete(999)).rejects.toThrow("Carta não encontrada")
    });

    it("id string",async () =>{
        await expect(cardService.delete("errado" as any)).rejects.toThrow("Id deve ser um inteiro")
    });

    it("id de classe",async () =>{
        await expect(cardService.delete({} as any)).rejects.toThrow("Id deve ser um inteiro")
    });
})