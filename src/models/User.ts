import { Model, DataTypes, Sequelize, Optional} from 'sequelize';
import bcrypt from 'bcrypt';


export interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
}

export interface UserCreationAttributes 
    extends Optional<UserAttributes, 'id' | 'createdAt'> {}


export class User 
    extends Model<UserAttributes, UserCreationAttributes> 
    implements UserAttributes 
{
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: string;
    public createdAt!: Date;

    public checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    static async hashPassword(user: User): Promise<void> {
        if(user.changed('password')) {
            const salt = 10;
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}

export function initUserModel(sequelize:Sequelize): void {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
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
            tableName: 'users',
            hooks: {
                beforeSave: User.hashPassword,
            }
        }
    );
}