import { Model, DataTypes, Sequelize } from 'sequelize';

export interface MovieAttributes {
    id: number;
    title: string;
    description: string;
    duration: number;
    posterUrl: string;
    createdAt: Date;
}

export class Movie
    extends Model<MovieAttributes>
    implements MovieAttributes
{
    public id!: number;
    public title!: string;
    public description!: string;
    public duration!: number;
    public posterUrl!: string;
    public createdAt!: Date;
}

export function initMovieModel(sequelize: Sequelize): void {
    Movie.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,

            },
            description: {
                type: DataTypes.STRING,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            posterUrl: {
                type: DataTypes.STRING,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'movies',
        }
    );
}