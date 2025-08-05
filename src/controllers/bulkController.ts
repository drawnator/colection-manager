import { AuthRequest } from "../middlewares/authMiddleware";
import { BulkService } from "../services/bulkService";
import { Request, Response } from 'express';
import { CardService } from "../services/cardService";

export class BulkController{
    private service: BulkService;
    private cardService :CardService;

    constructor(service:BulkService,cardService:CardService){
        this.service = service;
        this.cardService = cardService;
    }

    async create(req:AuthRequest,res:Response):Promise<Response>{
        try{
            const {ownerId,name,description} = req.body;
            if (req.user.id != ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (!ownerId || !name){
                return res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const new_ = await this.service.create({ownerId,name,description});
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

    async getUserBulks(req:Request,res:Response):Promise<void>{
        try{
            const userId = Number(req.query.id);
            if (!userId){
                res.status(400).json({message:'Id não informado.'});
            }
            else{
                const userBulks = await this.service.getByUserId(userId);
                res.status(201).json(userBulks);
            }

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
            const {ownerId,name,description} = req.body;
            const new_ = await this.service.update(id,{ownerId,name,description});
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

     async add_card(req:AuthRequest,res:Response):Promise<Response>{
        try{
            const {bulkId,cardId} = req.body;
            if (req.user.id != (await this.service.get(bulkId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (req.user.id != (await this.cardService.get(cardId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            await this.service.add_card(bulkId,cardId);
            return res.status(201).json({message:"success"})
        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async remove_card(req:AuthRequest,res:Response):Promise<Response>{
        try {
            const {bulkId,cardId} = req.body;
            if (req.user.id != (await this.service.get(bulkId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (req.user.id != (await this.cardService.get(cardId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            await this.service.remove_card(bulkId,cardId);
            return res.status(201).json({message:"success"})
        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
    
    async get_cards(req:Request,res:Response):Promise<void>{
        try {
            const id = Number(req.query.id);
            const _cards = await this.service.get_cards(id);
             res.status(201).json(_cards)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
}