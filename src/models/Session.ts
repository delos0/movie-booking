import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import { Movie } from './Movie'
import { Hall } from './Hall';

export interface SessionAttributes {
    id: number;
    movieId: number;
    hallId: number;
    startTime: Date;
    price: number;
    createdAt: Date;
}

export class Session
    extends Model<SessionAttributes>
    implements SessionAttributes
{
    public id!: number;
    public movieId!: number;
    public hallId!: number;
    public startTime!: Date;
    public price!: number;
    public createdAt!: Date;

    public readonly movie?: Movie;
    public readonly hall?: Hall;

    public static associations: {
        movie: Association<Session, Movie>;
        hall: Association<Session, Hall>;
    };

    public static associate() {
        Session.belongsTo(Movie, {
            foreignKey: 'movieId',
            as: 'movie',
        });
        Session.belongsTo(Hall, {
            foreignKey: 'hallId',
            as: 'hall',
        });
    }
}

export function initSessionModel(sequelize: Sequelize): void {
    Session.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            movieId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Movie,
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },  
            hallId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Hall,
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            price: {
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
            tableName: 'sessions',
        }
    );
}