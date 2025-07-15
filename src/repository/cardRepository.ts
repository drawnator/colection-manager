import { Card } from "../models/Card";

export class CardRepository {
    private model: typeof Card;

    constructor(){
        this.model = Card;
    }

    async create(data:any):Promise<Card>{
        return await this.model.create(data);
    }

    async findById(id:number): Promise<Card|null>{
    return await this.model.findByPk(id);
    }

    async update(id:number,data:Partial<Card>):Promise<[number]>{
        return await this.model.update(data,{where:{id}});
    }

    async delete(id:number):Promise<number>{
        return await this.model.destroy({where:{id}});
    }
}