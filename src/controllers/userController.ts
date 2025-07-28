import { UserService } from "../services/userService";
import { Request, Response } from 'express';

export class UserController{
    private userService: UserService;

    constructor(){
        this.userService = new UserService();
    }

    async createUser(req:Request,res:Response):Promise<void>{
        try{
            const userData = req.body;
            // if(!name || !email || !password){
            //     res.status(400).json({message:'Todos os campos são obrigatórios.'});
            // }
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async getAllUsers(req:Request,res:Response):Promise<void>{
        try{
            const activeUsers = await this.userService.getActiveUsers();
            res.status(201).json(activeUsers);
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async getUser(req:Request,res:Response):Promise<void>{
        try{
            const userId = Number(req.query.id);
            if (!userId){
                this.getAllUsers(req,res);
                // res.status(400).json({message:'Id não informado.'});
            }
            else{
                const activeUsers = await this.userService.getUser(userId);
                res.status(201).json(activeUsers);
            }
        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async deleteUser(req:Request,res:Response):Promise<void> {
        try {
            const userId = Number(req.query.id);
            if (!userId){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.userService.delete(userId);
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async update(req:Request,res:Response):Promise<void>{
        try{
            const {name,email,password} = req.body;
            if(!name && !email && !password){
                res.status(400).json({message:'sem informações para atualizar'});
            }
            const userId = Number(req.query.id);
            if (!userId){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.userService.update(userId,{name,email,password});
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

}