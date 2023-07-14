import { DataTypes, Model } from "sequelize";
export class LessonsClass extends Model {
}
export const LessonsInit = async (fastify) => {
    await LessonsClass.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        day_of_week: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_minute: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_hour: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        end_minute: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        end_hour: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_time: {
            type: DataTypes.VIRTUAL,
            get: function () {
                const start_hour = (this.start_hour < 10 ? "0" : "") + String(this.start_hour);
                const start_minute = (this.start_minute < 10 ? "0" : "") + String(this.start_minute);
                return `${start_hour}:${start_minute}`;
            },
            set: function (start_time) {
                [this.start_hour, this.start_minute] = start_time.split(":").map(a => Number(a));
            }
        },
        end_time: {
            type: DataTypes.VIRTUAL,
            get: function () {
                const end_hour = (this.end_hour < 10 ? "0" : "") + String(this.end_hour);
                const end_minute = (this.end_minute < 10 ? "0" : "") + String(this.end_minute);
                return `${end_hour}:${end_minute}`;
            },
            set: function (end_time) {
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
//# sourceMappingURL=Lessons.js.map