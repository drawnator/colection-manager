import { AuthRequest } from "../middlewares/authMiddleware";
import { CardService } from "../services/cardService";
import { DeckService } from "../services/deckService";
import { Request, Response } from 'express';

export class DeckController{
    private service: DeckService;
    private cardService:CardService;

    constructor(service:DeckService,cardService:CardService){
        this.service = service;
        this.cardService = cardService;
    }

    async create(req:AuthRequest,res:Response):Promise<Response>{
        try{
            const {ownerId,name,victories,losses} = req.body;
            if (req.user.id != ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (!ownerId || !name){
                return res.status(400).json({message:'nome e dono são obrigatórios'});
            }
            const new_ = await this.service.create({ownerId,name,victories,losses});
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
            const {ownerId,name,victories,losses} = req.body;
            if(!ownerId && !name && !victories && !losses){
                return res.status(400).json({message:'sem informações para atualizar'});
            }
            const new_ = await this.service.update(id,{ownerId,name,victories,losses});
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
            const {deckId,cardId} = req.body;
            if (req.user.id != (await this.service.get(deckId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (req.user.id != (await this.cardService.get(cardId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            await this.service.add_card(deckId,cardId);
            return res.status(201).json({message:"success"})
        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async remove_card(req:AuthRequest,res:Response):Promise<Response>{
        try {
            const {deckId,cardId} = req.body;
            if (req.user.id != (await this.service.get(deckId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            if (req.user.id != (await this.cardService.get(cardId)).ownerId) {
                return res.status(400).json({message:'Sem permissão'})
            }
            await this.service.remove_card(deckId,cardId);
            return res.status(201).json({message:"success"})
        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
    
    async get_cards(req:Request,res:Response):Promise<Response>{
        try {
            const id = Number(req.query.id);
            const _cards = await this.service.get_cards(id);
            return res.status(201).json(_cards)
        } catch (error){
            return res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
}