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
            throw new Error("instancia inexistente")
        }
        return instance;
    }

    async update(id:number,data:any):Promise<[number]>{
        const instance = this.repository.update(id,data);
        if (!instance){
            throw new Error("instancia inexistente")
        }
        return instance;
    }

    async delete(id:number):Promise<number>{
        const instance = this.repository.delete(id);
        if (!instance){
            throw new Error("instancia inexistente")
        }
        return instance;
    }
}