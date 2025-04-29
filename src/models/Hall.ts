import { Model, DataTypes, Sequelize } from 'sequelize';

export interface HallAttributes {
    id: number;
    name: string;
    rows: number;
    seatsPerRow: number;
    createdAt: Date;
}

export class Hall 
    extends Model<HallAttributes>
    implements HallAttributes
{
    public id!: number;
    public name!: string;
    public rows!: number;
    public seatsPerRow!: number;
    public createdAt!: Date;
}

export function initHallModel(sequelize: Sequelize): void {
    Hall.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
    
            },
            rows: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seatsPerRow: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'halls',
        }
    );
}