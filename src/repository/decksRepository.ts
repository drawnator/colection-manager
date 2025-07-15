import { Deck } from "../models/Deck";

export class CardRepository {
    private model: typeof Deck;

    constructor(){
        this.model = Deck;
    }

    async create(data:any):Promise<Deck>{
        return await this.model.create(data);
    }

    async findById(id:number): Promise<Deck|null>{
    return await this.model.findByPk(id);
    }

    async update(id:number,data:Partial<Deck>):Promise<[number]>{
        return await this.model.update(data,{where:{id}});
    }

    async delete(id:number):Promise<number>{
        return await this.model.destroy({where:{id}});
    }
}