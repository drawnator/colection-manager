import  sequelize from "../src/config/database";

import { CollectionService } from "../src/services/collectionService";

import { UserRepository } from "../src/repository/userRepository";
import { CardRepository } from "../src/repository/cardRepository";
import { BulkRepository } from "../src/repository/bulkRepository";
import { DeckRepository } from "../src/repository/deckRepository";
import { CollectionRepository } from "../src/repository/collectionRepository";
import { Collection } from "../src/models/Collection";

// usar https://pokemontcg.guru/
describe("criação de coleção",() =>{
    let collectionService: CollectionService;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        collectionService = new CollectionService(collectionRepository);

        await sequelize.sync({ force: true });
    });

    afterEach(()=>{
        sequelize.dropAllSchemas({})
    });

    it("dados completos simples",async () =>{
        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        const createdCollection = await collectionService.create(collectionData)
        expect(createdCollection).toHaveProperty("id");
        expect(createdCollection.id).toBe(collectionData.id);
        expect(createdCollection.family).toBe(collectionData.family);
        expect(createdCollection.name).toBe(collectionData.name);
        expect(createdCollection.total).toBe(collectionData.total);
    });
    
    it("sem familia",async () =>{
        const collectionData = {
            id:"COL",
            name:"Coleção 1",
            total:151};
        const createdCollection = await collectionService.create(collectionData)
        expect(createdCollection).toHaveProperty("id");
        expect(createdCollection.id).toBe(collectionData.id);
        expect(createdCollection.family).toBeNull();
        expect(createdCollection.name).toBe(collectionData.name);
        expect(createdCollection.total).toBe(collectionData.total);
    });

    it("sem nome",async () =>{
        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            total:151};
        const createdCollection = await collectionService.create(collectionData)
        expect(createdCollection).toHaveProperty("id");
        expect(createdCollection.id).toBe(collectionData.id);
        expect(createdCollection.family).toBe(collectionData.family);
        expect(createdCollection.name).toBeNull();
        expect(createdCollection.total).toBe(collectionData.total);
    });

    it("sem total",async () =>{
        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        const createdCollection = await collectionService.create(collectionData)
        expect(createdCollection).toHaveProperty("id");
        expect(createdCollection.id).toBe(collectionData.id);
        expect(createdCollection.family).toBe(collectionData.family);
        expect(createdCollection.name).toBe(collectionData.name);
        expect(createdCollection.total).toBeNull();
    });

    it("sem id",async () =>{
        const collectionData = {
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:151};
        await expect(collectionService.create(collectionData)).rejects.toThrow("Atributo em falta")
    });

    it("total em string",async () =>{
        const collectionData = {
            id:"COL",
            family:"Scarlet & Violet",
            name:"Coleção 1",
            total:"ABC"};
        await expect(collectionService.create(collectionData)).rejects.toThrow("Total deve ser um número")
    });
})

describe("busca de coleção",() =>{
    let collectionService: CollectionService;
    let collection1: Collection;
    let collection2: Collection;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        collectionService = new CollectionService(collectionRepository);

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
    });

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("Id válido",async () =>{
        const newCollection = await collectionService.get(collection1.id);
        expect(newCollection.id).toBe(collection1.id);
        expect(newCollection.name).toBe(collection1.name);
        expect(newCollection.family).toBe(collection1.family);
        expect(newCollection.total).toBe(collection1.total);

        const newCollection2 = await collectionService.get(collection2.id);
        expect(newCollection2.id).toBe(collection2.id);
        expect(newCollection2.name).toBe(collection2.name);
        expect(newCollection2.family).toBe(collection2.family);
        expect(newCollection2.total).toBe(collection2.total);

    });

    it("id inexistente",async () =>{
        await expect(collectionService.get("wrongID")).rejects.toThrow("Coleção não encontrada")
    });

    it("id int",async () =>{
        await expect(collectionService.get(1 as any)).rejects.toThrow("Id deve ser uma string")
    });

    it("id class",async () =>{
        await expect(collectionService.get({} as any)).rejects.toThrow("Id deve ser uma string")
    });
})

describe("atualização de coleção",() =>{
    let collectionService: CollectionService;
    let collection1: Collection;
    let collection2: Collection;

    beforeEach(async ()=>{
        const cardRepository = new CardRepository();
        const bulkRepository = new BulkRepository();
        const deckRepository = new DeckRepository();
        const collectionRepository = new CollectionRepository();
        const userRepository = new UserRepository();

        collectionService = new CollectionService(collectionRepository);

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
    });

    afterEach(()=>{sequelize.dropAllSchemas({})});

    it("atualização de nome",async () =>{
        const newName = "nova coleção";
        const updatedCollection = await collectionService.update(collection1.id,{name:newName});
        expect(updatedCollection[0]).toBe(1);
        const collection = await collectionService.get(collection1.id);
        expect(collection.name).toBe(newName);
    });

    it("atualização da familia",async () =>{
        const newFamily = "C & D";
        const updatedCollection = await collectionService.update(collection2.id,{family:newFamily});
        expect(updatedCollection[0]).toBe(1);
        const collection = await collectionService.get(collection2.id);
        expect(collection.family).toBe(newFamily);
    });

    it("atualização do total",async () =>{
        const newTotal = 100;
        const updatedCollection = await collectionService.update(collection1.id,{total:newTotal});
        expect(updatedCollection[0]).toBe(1);
        const collection = await collectionService.get(collection1.id);
        expect(collection.total).toBe(newTotal);
    });

    it("atualização de múltiplos valores",async () =>{
        const newName = "nova coleção";
        const newFamily = "C & D";
        const newTotal = 100;
        const updatedCollection = await collectionService.update(collection1.id,{name:newName,family:newFamily,total:newTotal});
        expect(updatedCollection[0]).toBe(1);
        const collection = await collectionService.get(collection1.id);
        expect(collection.id).toBe(collection1.id);
        expect(collection.name).toBe(newName);
        expect(collection.family).toBe(newFamily);
        expect(collection.total).toBe(newTotal);
    });

    // TODO: mudar ID para code para evitar problemas no BD
    it("atualização do ID",async () =>{
        const newID = "newCOL";
        const updatedCollection = await collectionService.update(collection1.id,{id:newID});
        expect(updatedCollection[0]).toBe(1);
        const collection = await collectionService.get(newID);
        expect(collection.id).toBe(newID);
        expect(collection.name).toBe(collection1.name);
        expect(collection.family).toBe(collection1.family);
        expect(collection.total).toBe(collection1.total);
    });

    it("atualização de id invalido",async () =>{
        await expect(collectionService.update("wrongID",{total:10})).rejects.toThrow("Coleção não encontrada")
    });
})

describe("apagar coleção",() =>{
    let collectionService: CollectionService;
    let collection1: Collection;
    let collection2: Collection;

    beforeEach(async ()=>{
    const cardRepository = new CardRepository();
    const bulkRepository = new BulkRepository();
    const deckRepository = new DeckRepository();
    const collectionRepository = new CollectionRepository();
    const userRepository = new UserRepository();

        collectionService = new CollectionService(collectionRepository);

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
    });

    afterEach(()=>{sequelize.dropAllSchemas({})});
    it("coleção existente",async () =>{
        const deleteId = collection1.id;
        const deletedCollection = await collectionService.delete(deleteId);
        expect(deletedCollection).toBe(1)
        await expect(collectionService.get(deleteId)).rejects.toThrow("Coleção não encontrada")
        await expect(collectionService.delete(deleteId)).rejects.toThrow("Coleção não encontrada")
        
    });
    it("id inexistente",async () =>{
        await expect(collectionService.delete("wrongID")).rejects.toThrow("Coleção não encontrada")
    });
    it("id numérico",async () =>{
        await expect(collectionService.delete(100 as any)).rejects.toThrow("Id deve ser uma string")
    });
    it("id de classe",async () =>{
        await expect(collectionService.delete({} as any)).rejects.toThrow("Id deve ser uma string")
    });
})