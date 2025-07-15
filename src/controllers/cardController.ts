import { CardService } from "../services/cardService";
import { Request, Response } from 'express';

export class CardController{
    private service: CardService;

    constructor(){
        this.service = new CardService();
    }

    async create(req:Request,res:Response):Promise<void>{
        try{
            const {ownerId,collectionCode,number,modifier} = req.body;
            if (!ownerId || !collectionCode || !number || !modifier){
                res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const new_ = await this.service.create({ownerId,collectionCode,number,modifier});
            res.status(201).json(new_);

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async get(req:Request,res:Response):Promise<void>{
        try{
            const {id} = req.body;
            const new_ = this.service.get(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async update(req:Request,res:Response):Promise<void>{
        try{
            const {id,attr} = req.body;
            const new_ = this.service.update(id,{attr});
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async delete(req:Request,res:Response):Promise<void>{
        try{
            const {id} = req.body;
            const new_ = this.service.delete(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
}