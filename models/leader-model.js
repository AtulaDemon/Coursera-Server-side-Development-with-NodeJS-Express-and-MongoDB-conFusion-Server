module.exports = (sequelize, Sequelize) => {
    const LeaderModel = sequelize.define("leader", {
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
            type: Sequelize.STRING(1000),
            allowNull: true,
        },
        image: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        designation: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        abbr: {
            type: Sequelize.STRING(50),
            defaultValue: ''  
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
        tableName: 'leader',
        underscored: true 
    });
  
    return LeaderModel;
};