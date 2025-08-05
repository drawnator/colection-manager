import { Model, DataTypes, Optional, BelongsToManyGetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Card } from './Card';
// import { CardToBulk } from './CardToBulk';

// Defina os atributos do modelo
interface BulkAttributes {
  id: number;
  ownerId: number;
  name:string;
  description:string;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type BulkCreationAttributes = Optional<BulkAttributes, 'id'|'description'>;


export class Bulk extends Model<BulkAttributes, BulkCreationAttributes> implements BulkAttributes {
  public id!: number;
  public ownerId!: number;
  public name!: string;
  public description!: string;

  declare getCards: BelongsToManyGetAssociationsMixin<Card>;
  declare addCard: BelongsToManyAddAssociationMixin<Card,Card['id']>;
  declare removeCard: BelongsToManyRemoveAssociationMixin<Card,Card['id']>;

  
}


// Inicialize o modelo com os campos no banco
Bulk.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "bulks", 
    timestamps: false,
  }
);

Bulk.belongsToMany(Card,{through:'CardToBulk',foreignKey:"bulkId"});
Card.belongsToMany(Bulk,{through:'CardToBulk',foreignKey:"cardId"});

//TODO Deck.belongsTo(User);