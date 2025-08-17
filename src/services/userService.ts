import { User} from "../models/User";
import { BulkRepository } from "../repository/bulkRepository";
import { UserRepository } from "../repository/userRepository";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'

export class UserService {
    private userRepository: UserRepository;
    private bulkRepository: BulkRepository
    private jwtSecret: jwt.Secret;

    constructor(userRepository:UserRepository,bulkRepository:BulkRepository){
        this.userRepository = userRepository;
        this.bulkRepository = bulkRepository;
        this.jwtSecret = (process.env.JWT_SECRET || "defaultSecret") as jwt.Secret;
    }

    async createUser(userData:User):Promise<User>{
        if (userData.password.length<6){
            throw new Error('A senha deve ter pelo menos 6 caracteres.')
        }
        return await this.userRepository.create(userData);
    }
    async createUserCrypt(userData:any):Promise<User>{
        if (userData.password.length<6){
            throw new Error('A senha deve ter pelo menos 6 caracteres.')
        }
        const hashedPassword = await bcrypt.hash(userData.password,10)
        const userWithHashedPass = { ...userData, password: hashedPassword };

        const createdUser = await this.userRepository.create(userWithHashedPass);
        const startingBulk = {ownerId:createdUser.id,name:process.env.BASE_BULK,description:""}
        await this.bulkRepository.create(startingBulk);
        return createdUser
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
        let userWithHashedPass = { ...attr };
        if (attr.password) {
            const hashedPassword = await bcrypt.hash(attr.password, 10);
            userWithHashedPass.password = hashedPassword;
        }
        const user = await this.userRepository.update(id, userWithHashedPass);
        if (!user){
            throw new Error("Usuário não encontrado");
        }
        return user;
    }
    async updateCrypt(id: number,attr:Partial<User>):Promise<[Number]>{
        if (attr.password) {
            const hashedPassword = await bcrypt.hash(attr.password, 10);
            attr.password = hashedPassword;
        }
        const user = await this.userRepository.update(id,attr);
        if (!user){
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user){
            throw new Error('Email ou senha incorretos')
        }
        const passwordOK = await bcrypt.compare(password,user.password);
        if (!passwordOK){
            throw new Error("Email ou senha incorretos");
        }

        const payload = {id:user.id, email:user.email};

        const token = jwt.sign(payload,this.jwtSecret,{expiresIn: '1h'})
        return {user, token};

    }
}