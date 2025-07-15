import { Collection } from "../models/Collection";
import { CollectionRepository } from "../repository/collectionRepository";

export class CollectionService{
    private repository: CollectionRepository;

    constructor(){
        this.repository = new CollectionRepository();
    }

    async create(data:any):Promise<Collection>{
        return await this.repository.create(data)
    }

    async get(id:number):Promise<Collection>{
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