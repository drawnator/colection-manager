import { Model, DataTypes, Optional, BelongsToManyGetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Card } from './Card';

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

  declare getCards: BelongsToManyGetAssociationsMixin<Card>;
  declare addCard: BelongsToManyAddAssociationMixin<Card,Card['id']>;
  declare removeCard: BelongsToManyRemoveAssociationMixin<Card,Card['id']>;
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

Deck.belongsToMany(Card,{through:'CardToDeck',foreignKey:'deckId'});
Card.belongsToMany(Deck,{through:'CardToDeck',foreignKey:'cardId'});