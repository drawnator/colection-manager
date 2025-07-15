import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Card } from './Card';
import { Deck } from './Deck';

interface CardToDeckAttributes {
  cardId: number;
  deckId: number;
  ammount: number;
}

export class CardToDeck extends Model<CardToDeckAttributes> {
  public cardId!: number;
  public deckId!: number;
  public ammount!: number;
}


// Inicialize o modelo com os campos no banco
CardToDeck.init(
  {
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Card,
        key: 'id',
        },
    },
    deckId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Deck,
        key: 'id',
        },
    },
    ammount:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  },
  {
    sequelize,
    tableName: "cardToDeck", 
    timestamps: false,
  }
);
Deck.belongsToMany(Card,{through:CardToDeck});
Card.belongsToMany(Deck,{through:CardToDeck});
// Deck.hasMany(Card);
