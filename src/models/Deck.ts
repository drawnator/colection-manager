import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// Defina os atributos do modelo
interface DeckAttributes {
  id: number;
  ownerId: number;
  name: string;
  victories:number;
  losses:number;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type DeckCreationAttributes = Optional<DeckAttributes, 'id'|'victories'|'losses'>;


export class Deck extends Model<DeckAttributes, DeckCreationAttributes> implements DeckAttributes {
  public id!: number;
  public ownerId!: number;
  public name!:string;
  public victories!: number;
  public losses!: number;
}


// Inicialize o modelo com os campos no banco
Deck.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
              model: User,
              key: 'id',
            }
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    victories:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    losses:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "decks", 
    timestamps: false,
  }
);