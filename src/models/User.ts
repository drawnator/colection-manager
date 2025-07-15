import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Deck } from './Deck';
import { Bulk } from './Bulk';
import { Card } from './Card';


// Defina os atributos do modelo
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type UserCreationAttributes = Optional<UserAttributes, 'id'>;


export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
}


// Inicialize o modelo com os campos no banco
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users", 
    timestamps: false,
  }
);

User.hasMany(Deck,{foreignKey:'ownerId'});
Deck.belongsTo(User);

User.hasMany(Bulk,{foreignKey:'ownerId'});
Bulk.belongsTo(User);

User.hasMany(Card,{foreignKey:'ownerId'});
Card.belongsTo(User);