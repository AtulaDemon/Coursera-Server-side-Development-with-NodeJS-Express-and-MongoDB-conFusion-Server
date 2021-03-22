module.exports = (sequelize, Sequelize) => {
    const CommentModel = sequelize.define("comment", {
        id: {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true  
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        comment: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()")
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()")
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()")
        }
    }, {
        sequelize,
        tableName: 'comment',
        underscored: true,
        classMethods: {
            associate: function(models){
                CommentModel.belongsTo(models.dish, {as: 'dish', foreignKey: 'dishId'}),
                CommentModel.belongsTo(models.user, {as: 'author', foreignKey: 'authorId'})
            }
        }
    });
  
    return CommentModel;
};