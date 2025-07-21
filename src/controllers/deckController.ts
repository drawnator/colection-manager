import { DeckService } from "../services/deckService";
import { Request, Response } from 'express';

export class DeckController{
    private service: DeckService;

    constructor(){
        this.service = new DeckService();
    }

    async create(req:Request,res:Response):Promise<void>{
        try{
            const {ownerId,name,victories,losses} = req.body;
            if (!ownerId || !name){
                res.status(400).json({message:'nome e dono são obrigatórios'});
            }
            const new_ = await this.service.create({ownerId,name,victories,losses});
            res.status(201).json(new_);

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async get(req:Request,res:Response):Promise<void>{
        try{
            const id = Number(req.params.id);
            if (!id){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.service.get(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async update(req:Request,res:Response):Promise<void>{
        try{
            const id = Number(req.params.id);
            if (!id){
                res.status(400).json({message:'Id não informado.'});
            }
            const {ownerId,name,victories,losses} = req.body;
            if(!ownerId && !name && !victories && !losses){
                res.status(400).json({message:'sem informações para atualizar'});
            }
            const new_ = await this.service.update(id,{ownerId,name,victories,losses});
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async delete(req:Request,res:Response):Promise<void>{
        try{
            const id = Number(req.params.id);
            if (!id){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.service.delete(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
}