import { Collection } from "../models/Collection";

export class CollectionRepository {
    private model: typeof Collection;

    constructor(){
        this.model = Collection;
    }

    async create(data:any):Promise<Collection>{
        return await this.model.create(data);
    }

    async findById(id:string): Promise<Collection|null>{
    return await this.model.findByPk(id);
    }

    async update(id:string,data:Partial<Collection>):Promise<[number]>{
        return await this.model.update(data,{where:{id}});
    }

    async delete(id:string):Promise<number>{
        return await this.model.destroy({where:{id}});
    }
}