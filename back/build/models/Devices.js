import { DataTypes, Model } from "sequelize";
export class DevicesClass extends Model {
}
export const DevicesInit = async (fastify) => {
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
//# sourceMappingURL=Devices.js.map