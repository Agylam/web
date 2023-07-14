import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {FastifyInstance} from "fastify";

export class LessonsClass extends Model<InferAttributes<LessonsClass>, InferCreationAttributes<LessonsClass>>{
	declare id: number;
	declare day_of_week: number;
	declare start_minute: number;
	declare start_hour: number;
	declare end_minute: number;
	declare end_hour: number;

	declare start_time: string;
	declare end_time:string;
}

export const LessonsInit =  async (fastify: FastifyInstance) =>{
	await LessonsClass.init({
		id:{
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		day_of_week:{
			type: DataTypes.INTEGER,
			allowNull: false
		},
		start_minute:{
			type: DataTypes.INTEGER,
			allowNull: false
		},
		start_hour:{
			type: DataTypes.INTEGER,
			allowNull: false
		},
		end_minute:{
			type: DataTypes.INTEGER,
			allowNull: false
		},
		end_hour:{
			type: DataTypes.INTEGER,
			allowNull: false
		},

		start_time:{
			type: DataTypes.VIRTUAL,
			get: function () : string {
				const start_hour = (this.start_hour < 10 ? "0":"") + String(this.start_hour) as string;
				const start_minute = (this.start_minute < 10 ? "0":"") + String(this.start_minute) as string;
				return `${start_hour}:${start_minute}`;
			},
			set: function (start_time : string){
				[this.start_hour, this.start_minute] = start_time.split(":").map(a => Number(a));
			}
		},
		end_time:{
			type: DataTypes.VIRTUAL,
			get: function () : string {
				const end_hour = (this.end_hour < 10 ? "0":"") + String(this.end_hour) as string;
				const end_minute = (this.end_minute < 10 ? "0":"") + String(this.end_minute) as string;
				return `${end_hour}:${end_minute}`;
			},
			set: function (end_time : string){
				[this.end_hour, this.end_minute] = end_time.split(":").map(a => Number(a));
			}
		}
	}, {
		sequelize: fastify?.db,
		modelName: "Lessons",
		tableName: "lessons"
	});
	await fastify.db.sync({ alter: true });
	return fastify.db.models.Lessons;

};
