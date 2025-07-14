import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Defina os atributos do modelo
interface CollectionAttributes {
  id: number;
  family: string;
  name: string;
  code: string;
  total: number;
}

//professor esqueceu de adicionar essa linha importante para o código funcionar
type CollectionCreationAttributes = Optional<CollectionAttributes, 'id'>;


export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
  public id!: number;
  public family!: string;
  public name!: string;
  public code!: string;
  public total!: number;
}


// Inicialize o modelo com os campos no banco
Collection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "users", 
    timestamps: false,
  }
);
