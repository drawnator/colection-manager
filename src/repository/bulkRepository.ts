import { Bulk } from "../models/Bulk";

export class BulkRepository {
    private model: typeof Bulk;

    constructor(){
        this.model = Bulk;
    }

    async create(data:any):Promise<Bulk>{
        return await this.model.create(data);
    }

    async findById(id:number): Promise<Bulk|null>{
    return await this.model.findByPk(id);
    }

    async update(id:number,data:Partial<Bulk>):Promise<[number]>{
        return await this.model.update(data,{where:{id}});
    }

    async delete(id:number):Promise<number>{
        return await this.model.destroy({where:{id}});
    }
}