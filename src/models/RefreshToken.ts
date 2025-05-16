import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { User } from "./User";

interface RefreshTokenAttributes{
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
    revoked: boolean;
}

interface RefreshTokenCreation 
    extends Optional<RefreshTokenAttributes, 'id' | 'revoked'> {}

export class RefreshToken
    extends Model<RefreshTokenAttributes, RefreshTokenCreation>
    implements RefreshTokenAttributes
{
    public id!: number;
    public token!: string;
    public userId!: number;
    public expiresAt!: Date;
    public revoked!: boolean; 
}

export function initRefreshTokenModel(sequelize: Sequelize): void {
    RefreshToken.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            revoked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            tableName: 'refresh_tokens',
        }
    );
}

RefreshToken.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(RefreshToken, {foreignKey: 'userID'});