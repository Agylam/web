import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {compareSync, genSaltSync, hashSync} from "bcrypt-ts";
import {FastifyInstance} from "fastify";

export class UsersClass extends Model<InferAttributes<UsersClass>, InferCreationAttributes<UsersClass>>{
	declare id: number;
	declare email: string;
	declare password: string;
	declare fullname: string;
	declare uid: string;
	declare group_id: number;
	validatePassword(password: string): boolean {
		return compareSync(password, this.password);
	}
}

export const UsersInit = async (fastify: FastifyInstance) =>{
	await UsersClass.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			set(password: string) {
				this.setDataValue("password", hashSync(password, genSaltSync(10)));
			}
		},
		fullname: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		uid: {
			type: DataTypes.STRING(14),
			allowNull: false,
			unique: true
		},
		group_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	}, {
		sequelize: fastify.db,
		modelName: "Users",
		tableName: "users"
	});
	await fastify.db.sync({ alter: true });
	return fastify.db.models.UidSessions;
};
