import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Card } from './Card';
import { Bulk } from './Bulk';

interface CardToBulkAttributes {
  cardId: number;
  BulkId: number;
  ammount: number;
}

export class CardToBulk extends Model<CardToBulkAttributes> {
  public cardId!: number;
  public BulkId!: number;
  public ammount!: number;
}


// Inicialize o modelo com os campos no banco
CardToBulk.init(
  {
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Card,
        key: 'id',
        },
    },
    BulkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Bulk,
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
    tableName: "cardToBulk", 
    timestamps: false,
  }
);
Bulk.belongsToMany(Card,{through:CardToBulk});
Card.belongsToMany(Bulk,{through:CardToBulk});
// Bulk.hasMany(Card);
