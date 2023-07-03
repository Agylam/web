import { DataTypes, Model } from "sequelize";
export class UidSessionsClass extends Model {
}
export const UidSessionsInit = async (fastify) => {
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
//# sourceMappingURL=UidSessions.js.map