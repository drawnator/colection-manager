import { AuthRequest } from "../middlewares/authMiddleware";
import { UserService } from "../services/userService";
import { Request, Response } from 'express';

export class UserController{
    private userService: UserService;

    constructor(userService:UserService){
        this.userService = userService;
    }

    async createUser(req:Request,res:Response):Promise<void>{
        try{
            const userData = req.body;
            if(!userData.name || !userData.email || !userData.password){
                res.status(400).json({message:'Todos os campos são obrigatórios.'});
            }
            const newUser = await this.userService.createUserCrypt(userData);
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

    async deleteUser(req:AuthRequest,res:Response):Promise<void> {
        try {
            const userId = Number(req.user.id);
            if (!userId){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.userService.delete(userId);
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async update(req:AuthRequest,res:Response):Promise<void>{
        try{
            const userData = req.body;
            if(!userData.name && !userData.email && !userData.password){
                res.status(400).json({message:'sem informações para atualizar'});
            }
            console.log(req.user)
            const userId = Number(req.user.id);
            if (!userId){
                res.status(400).json({message:'Id não informado.'});
            }
            const new_ = await this.userService.update(userId,userData);
            res.status(201).json(new_)

        } catch (error){
            res.status(500).json({ message: (error instanceof Error ? error.message : 'Internal server error') });
        }  
    }

    async login(req:Request, res:Response):Promise<Response>{
        try{
            const{email,password} = req.body;
            const authResult = await this.userService.authenticate(email,password);
            return res.json(authResult);
        } catch (error:any){
            return res.status(400).json({message:error.message});
        }
    }

}