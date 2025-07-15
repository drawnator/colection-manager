import { Deck } from "../models/Deck";
import { DeckRepository } from "../repository/deckRepository";

export class DeckService{
    private repository: DeckRepository;

    constructor(){
        this.repository = new DeckRepository();
    }

    async create(data:any):Promise<Deck>{
        return await this.repository.create(data)
    }

    async get(id:number):Promise<Deck>{
        const instance = await this.repository.findById(id);
        if (!instance) {
            throw new Error("instancia inexistence")
        }
        return instance;
    }

    async update(id:number,data:any):Promise<[number]>{
        return await this.repository.update(id,data);
    }

    async delete(id:number):Promise<number>{
        return await this.repository.delete(id);
    }
}