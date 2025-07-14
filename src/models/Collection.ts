import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Card } from './Card';

// Defina os atributos do modelo
interface CollectionAttributes {
  id: string;
  family: string;
  name: string;
  total: number;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type CollectionCreationAttributes = Optional<CollectionAttributes, 'total' | 'family' | 'name'>;


export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
  public id!: string;
  public family!: string;
  public name!: string;
  public total!: number;
}


// Inicialize o modelo com os campos no banco
Collection.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    family: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "collection", 
    timestamps: false,
  }
);

Collection.hasMany(Card,{foreignKey:'collectionCode'});