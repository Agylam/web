import { DataTypes, Model } from "sequelize";
export class RefreshTokensClass extends Model {
    async getUser() {
        return this.sequelize.models.Users.findOne({ where: { id: this.user_id } });
    }
}
export const RefreshTokensInit = async (fastify) => {
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
//# sourceMappingURL=RefreshTokens.js.map