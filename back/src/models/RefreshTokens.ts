import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {FastifyInstance} from "fastify";

export class RefreshTokensClass extends Model<InferAttributes<RefreshTokensClass>, InferCreationAttributes<RefreshTokensClass>>{
	declare token: string;
	declare user_id: number;
	declare active: boolean;
	async getUser () {
		return this.sequelize.models.Users.findOne({where: {id: this.user_id as number}});
	}
}

export const RefreshTokensInit =  async (fastify: FastifyInstance) =>{
	await RefreshTokensClass.init({
		token: {
			type: DataTypes.STRING(64),
			allowNull: false,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		sequelize: fastify?.db,
		modelName: "RefreshTokens",
		tableName: "refresh_tokens"
	});
	await fastify.db.sync();
	return fastify.db.models.Devices;

};
