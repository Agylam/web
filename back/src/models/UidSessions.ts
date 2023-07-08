import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {FastifyInstance} from "fastify";

export class UidSessionsClass extends Model<InferAttributes<UidSessionsClass>, InferCreationAttributes<UidSessionsClass>>{
	declare uuid: string;
	declare PCRandom: string;
	declare active: boolean;
	declare device_id: number;
}

export const UidSessionsInit =  async (fastify: FastifyInstance) =>{
	await UidSessionsClass.init({
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		PCRandom: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		device_id: {
			type: DataTypes.UUID,
			allowNull: false
		}
	}, {
		sequelize: fastify.db,
		modelName: "UidSessions",
		tableName: "uid_sessions"
	});
	await fastify.db.sync();
	return fastify.db.models.UidSessions;
};
