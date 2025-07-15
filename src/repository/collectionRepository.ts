import { Collection } from "../models/Collection";

export class CollectionRepository {
    private model: typeof Collection;

    constructor(){
        this.model = Collection;
    }

    async create(data:any):Promise<Collection>{
        return await this.model.create(data);
    }

    async findById(id:number): Promise<Collection|null>{
    return await this.model.findByPk(id);
    }

    async update(id:number,data:Partial<Collection>):Promise<[number]>{
        return await this.model.update(data,{where:{id}});
    }

    async delete(id:number):Promise<number>{
        return await this.model.destroy({where:{id}});
    }
}