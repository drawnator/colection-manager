import { AuthRequest } from "../middlewares/authMiddleware";
import { CardService } from "../services/cardService";
import { Request, Response } from 'express';

export class CardController{
    private service: CardService;

    constructor(service:CardService){
        this.service = service;
    }

    async create(req:AuthRequest,res:Response):Promise<Response>{
        try{
            const {ownerId,collectionCode,number,modifier} = req.body;
            if (req.user.id != ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (!ownerId || !collectionCode || !number || !modifier){
                return res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const new_ = await this.service.create({ownerId,collectionCode,number,modifier});
            return res.status(201).json(new_);

        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async get(req:Request,res:Response):Promise<void>{
        try{
            const id = Number(req.query.id);
            if (!id){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.service.get(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async update(req:AuthRequest,res:Response):Promise<Response>{
        try{
            const id = Number(req.query.id);
            if (!id){
                return res.status(400).json({message:'Id não informado.'});
            }
            if (req.user.id != (await this.service.get(id)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            const {ownerId,collectionCode,number,modifier} = req.body;
            if(!ownerId && !collectionCode && !number && !modifier){
                return res.status(400).json({message:'sem informações para atualizar'});
            }
            const new_ = await this.service.update(id,{ownerId,collectionCode,number,modifier});
            return res.status(201).json(new_)

        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async delete(req:AuthRequest,res:Response):Promise<Response>{
        try{
            const id = Number(req.query.id);
            if (!id){
                return res.status(400).json({message:'Id não informado.'});
            }
            if (req.user.id != (await this.service.get(id)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            const new_ = await this.service.delete(id);
            return res.status(201).json(new_)
        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
}