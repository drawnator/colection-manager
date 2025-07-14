import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

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
    },
    name: {
      type: DataTypes.ARRAY,
      allowNull: false,
      unique: true,
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

//TODO Deck.belongsTo(User);