import { CollectionService } from "../services/collectionService";
import { Request, Response } from 'express';

export class CollectionController{
    private service: CollectionService;

    constructor(){
        this.service = new CollectionService();
    }

    async create(req:Request,res:Response):Promise<void>{
        try{
            const {id,family,name,total} = req.body;
            if (!id){
                res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const new_ = await this.service.create({id,family,name,total});
            res.status(201).json(new_);

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async get(req:Request,res:Response):Promise<void>{
        try{
            const {id} = req.body;
            const new_ = await this.service.get(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async update(req:Request,res:Response):Promise<void>{
        try{
            const {id,attr} = req.body;
            const new_ = await this.service.update(id,{attr});
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async delete(req:Request,res:Response):Promise<void>{
        try{
            const {id} = req.body;
            const new_ = await this.service.delete(id);
            res.status(201).json(new_)
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }
}