module.exports = (sequelize, Sequelize) => {
    const DishModel = sequelize.define("dish", {
        id: {
            type:Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true  
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        image: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        category: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        label: {
            type: Sequelize.STRING(50),
            defaultValue: ''  
        },
        price: {
            type: Sequelize.DECIMAL(13,2),
            allowNull: false,
            min: 0
        },
        featured: {
            type: Sequelize.BOOLEAN,
            defaultValue: false  
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
        tableName: 'dish',
        underscored: true,
        classMethods:{
            associate:function(models){
                DishModel.hasMany(models.comment, {as: 'dish', foreignKey: 'dishId'});
            }
        }
    });
  
    return DishModel;
};