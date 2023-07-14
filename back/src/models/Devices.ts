import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {FastifyInstance} from "fastify";

export class DevicesClass extends Model<InferAttributes<DevicesClass>, InferCreationAttributes<DevicesClass>>{
	declare uuid: string;
	declare secret: string;
}

export const DevicesInit =  async (fastify: FastifyInstance) =>{
	await DevicesClass.init({
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		secret: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		}
	}, {
		sequelize: fastify?.db,
		modelName: "Devices",
		tableName: "devices"
	});
	await fastify.db.sync({ alter: true });
	return fastify.db.models.Devices;

};
