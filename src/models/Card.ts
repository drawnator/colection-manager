import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

enum Modifier {
  Normal,
  holo,
  Reverse,
  // pokeball,
  // masterball,
  // Full,
  // Rainbow,
  // Alt,
  // Star,
  // Prism,
  // shiny,
  // gold
}
// Defina os atributos do modelo
interface CardAttributes {
  id: number;
  collection: string;
  number: number;
  modifier: Modifier;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type CardCreationAttributes = Optional<CardAttributes, 'id'>;


export class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
  public id!: number;
  public collection!: string;
  public number!: number;
  public modifier!: Modifier;
}


// Inicialize o modelo com os campos no banco
Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    collection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    modifier: {
      type: DataTypes.ENUM,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users", 
    timestamps: false,
  }
);
