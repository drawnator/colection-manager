import { Bulk } from "../models/Bulk";
import { BulkRepository } from "../repository/bulkRepository";

export class BulkService{
    private repository: BulkRepository;

    constructor(){
        this.repository = new BulkRepository();
    }

    async create(data:any):Promise<Bulk>{
        return await this.repository.create(data)
    }

    async get(id:number):Promise<Bulk>{
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