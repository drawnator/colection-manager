import { BulkService } from "../services/bulkService";
import { Request, Response } from 'express';

export class BulkController{
    private service: BulkService;

    constructor(){
        this.service = new BulkService();
    }

    async create(req:Request,res:Response):Promise<void>{
        try{
            const {ownerId,name,description} = req.body;
            if (!ownerId || !name){
                res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const new_ = await this.service.create({ownerId,name,description});
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
            const {ownerId,name,description} = req.body;
            const new_ = await this.service.update(id,{ownerId,name,description});
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