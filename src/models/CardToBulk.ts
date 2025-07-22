import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Card } from './Card';
import { Bulk } from './Bulk';

interface CardToBulkAttributes {
  id: number;
  cardId: number;
  BulkId: number;
  // ammount: number;
}

export class CardToBulk extends Model<CardToBulkAttributes> {
  public id!: number;
  public cardId!: number;
  public BulkId!: number;
  // public ammount!: number;
}


// Inicialize o modelo com os campos no banco
CardToBulk.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
        }
    },
    // ammount:{
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // }
  },
  {
    sequelize,
    tableName: "cardToBulk", 
    timestamps: false,
  }
);
// Bulk.hasMany(Card);
