import { Collection } from "../models/Collection";
import { CollectionRepository } from "../repository/collectionRepository";

export class CollectionService{
    private repository: CollectionRepository;

    constructor(repository:CollectionRepository){
        this.repository = repository;
    }

    async create(data:any):Promise<Collection>{
        return await this.repository.create(data)
    }

    async get(id:string):Promise<Collection>{
        const instance = await this.repository.findById(id);
        if (!instance) {
            throw new Error("instancia inexistence")
        }
        return instance;
    }

    async update(id:string,data:any):Promise<[number]>{
        return await this.repository.update(id,data);
    }

    async delete(id:string):Promise<number>{
        return await this.repository.delete(id);
    }
}