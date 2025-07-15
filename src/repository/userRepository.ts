import { User } from "../models/User";
import sequelize from "../config/database";

export class UserRepository {
  private UserModel: typeof User;

  constructor(){
    this.UserModel = User;//sequelize.model('User');
  }
    // Criar um novo usuário
  async create(UserData:Omit<User,'id'|'isActive'>):Promise<User> {
    const existingUser = await this.UserModel.findOne({where:{email:UserData.email}});
    if (existingUser){
      throw new Error('Email já está em uso.');
    }
    // Use o método `create` para salvar no banco de dados
    return await this.UserModel.create(UserData);
  }

  async findActiveUsers(): Promise<User[]>{
    return await this.UserModel.findAll({where:{isActive:true}});
  }

  async findById(id:number): Promise<User|null>{
    return await this.UserModel.findByPk(id);
  }

  //modificado [number,User[]] -> [number]
  async update(id:number,UserData:Partial<User>):Promise<[number]>{
    return await this.UserModel.update(UserData,{where:{id}});
  }

  async deactivateUser(id:number):Promise<[number]>{
    return await this.UserModel.update({isActive:false},{where:{id}});
  }

  async findByEmail(email:string):Promise<User|null>{
    return await this.UserModel.findOne({where:{email}});
  }

  async getAllUsers() {
    return await User.findAll();
  }
}
