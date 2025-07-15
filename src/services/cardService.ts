import { Card } from "../models/Card";
import { CardRepository } from "../repository/cardRepository";

export class CardService{
    private repository: CardRepository;

    constructor(){
        this.repository = new CardRepository();
    }

    async create(data:any):Promise<Card>{
        return await this.repository.create(data)
    }

    async get(id:number):Promise<Card>{
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