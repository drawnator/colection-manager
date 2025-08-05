import { Card } from "../models/Card";
import { Deck } from "../models/Deck";
import { DeckRepository } from "../repository/deckRepository";

export class DeckService{
    private repository: DeckRepository;

    constructor(repository:DeckRepository){
        this.repository = repository;
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

    async add_card(id:number,cardId:number):Promise<void>{
            return await this.repository.add_card(id,cardId);
        }
    
    async remove_card(id:number,cardId:number):Promise<void>{
        return await this.repository.remove_card(id,cardId);
        }
    
    async get_cards(id:number):Promise<Card[]>{
        return await this.repository.get_cards(id);
    }
}