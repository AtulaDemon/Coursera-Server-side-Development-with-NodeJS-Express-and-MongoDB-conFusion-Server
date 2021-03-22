const passportLocalSequelize = require('passport-local-sequelize');

module.exports = (sequelize, Sequelize) => {
    const UserModel = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING(50)
        },
        hash: {
            type: Sequelize.STRING(2000),
        },
        salt: {
            type: Sequelize.STRING(200),
        },
        admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        firstname: {
            type: Sequelize.STRING(50),
            defaultValue: ''
        },
        lastname: {
            type: Sequelize.STRING(50),
            defaultValue: ''
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        lastLogin: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
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
        tableName: 'user',
        underscored: true,
        classMethods:{
            associate:function(models){
                UserModel.hasMany(models.comment, {as: 'author', foreignKey: 'authorId'});
            }
        }
    });

    passportLocalSequelize.attachToUser(UserModel, {
        usernameField: 'username',
        hashField: 'hash',
        saltField: 'salt'
    });

    return UserModel;
}