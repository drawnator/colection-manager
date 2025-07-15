import { User} from "../models/User";
import { UserRepository } from "../repository/userRepository";

export class UserService {
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepository();
    }

    async createUser(userData:any):Promise<User>{
        if (userData.password.length<6){
            throw new Error('A senha deve ter pelo menos 6 caracteres.')
        }
        return await this.userRepository.create(userData);
    }

    async getActiveUsers():Promise<User[]>{
        return await this.userRepository.findActiveUsers();
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