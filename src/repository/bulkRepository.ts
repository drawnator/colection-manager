import { Bulk } from "../models/Bulk";
import { Card } from "../models/Card";

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

    async add_card(id:number,cardId:number):Promise<void>{
        const _bulk = await this.model.findByPk(id);
        if (!_bulk) {
            throw Error("modelo inexistente");
        }
        return await _bulk.addCard(cardId);
    }

    async remove_card(id:number,cardId:number):Promise<void>{
        const _bulk = await this.model.findByPk(id);
        if (!_bulk) {
            throw Error("modelo inexistente");
        }
        return await _bulk.removeCard(cardId);
    }

    async get_cards(id:number):Promise<Card[]>{
        const _bulk = await this.model.findByPk(id);
        if (!_bulk) {
            throw Error("modelo inexistente");
        }
        return await _bulk.getCards();
    }
}