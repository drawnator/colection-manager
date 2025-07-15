import { UserService } from "../services/userService";
import { User } from "../models/User";
import { Request, Response } from 'express';

export class UserController{
    private userService: UserService;

    constructor(){
        this.userService = new UserService();
    }

    async createUser(req:Request,res:Response):Promise<void>{
        try{
            const{name,email,password} = req.body;
            if(!name || !email || !password){
                res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const newUser = await this.userService.createUser({name,email,password});
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
}