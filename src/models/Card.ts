import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Collection } from './Collection';
import { User } from './User';

enum Modifier {
  Normal = 'normal',
  holo = 'holo',
  Reverse = 'reverse',
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
  ownerId: number;
  collectionCode: String;
  number: number;
  modifier: Modifier;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type CardCreationAttributes = Optional<CardAttributes, 'id'>;


export class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
  public id!: number;
  public ownerId!: number;
  public collectionCode!: String;
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
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: User,
        key: 'id',
      }
    },
    collectionCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references:{
        model: Collection,
        key: 'id',
      }
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    modifier: {
      type: DataTypes.ENUM,
      values: Object.values(Modifier),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "cards", 
    timestamps: false,
  }
);

Collection.hasMany(Card,{foreignKey:'collectionCode'});
Card.belongsTo(Collection);