import { Card } from "../models/Card";
import { Deck } from "../models/Deck";

export class DeckRepository {
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

    async add_card(id:number,cardId:number):Promise<void>{
        const _deck = await this.model.findByPk(id);
        if (!_deck) {
            throw Error("modelo inexistente");
        }
        return await _deck.addCard(cardId);
    }
    
    async remove_card(id:number,cardId:number):Promise<void>{
        const _deck = await this.model.findByPk(id);
        if (!_deck) {
            throw Error("modelo inexistente");
        }
        return await _deck.removeCard(cardId);
    }

    async get_cards(id:number):Promise<Card[]>{
        const _deck = await this.model.findByPk(id);
        if (!_deck) {
            throw Error("modelo inexistente");
        }
        return await _deck.getCards();
    }
}