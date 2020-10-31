
module.exports = (sequelize, DataTypes) => {

    const Image = sequelize.define("Image", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        imagePath: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        mime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Image.associate = models => {
        Image.belongsTo(models.User);
    };

    return Image;
}