import { User} from "../models/User";
import { UserRepository } from "../repository/userRepository";

export class UserService {
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepository();
    }

    async createUser(userData:User):Promise<User>{
        if (userData.password.length<6){
            throw new Error('A senha deve ter pelo menos 6 caracteres.')
        }
        return await this.userRepository.create(userData);
    }

    async getActiveUsers():Promise<User[]>{
        return await this.userRepository.findActiveUsers();
    }

    async getUser(id: number):Promise<User>{
        const user = await this.userRepository.findById(id);
        if (!user){
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    async delete(id: number):Promise<[Number]>{
        const user = await this.userRepository.deactivateUser(id);
        if (!user){
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    async update(id: number,attr:Partial<User>):Promise<[Number]>{
        const user = await this.userRepository.update(id,attr);
        if (!user){
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    async authenticate(email:string,password:string):Promise<User>{
        const user = await this.userRepository.findByEmail(email);
        if (!user){
            throw new Error('Email ou senha incorretos')
        }
        if (user.password !== password){
            throw new Error('Email ou senha incorretos')
        }
        return user;

    }
}