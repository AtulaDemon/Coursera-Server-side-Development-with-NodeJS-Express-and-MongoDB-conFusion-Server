const db = require('../models');
const UserModel = db.user;

module.exports.getAllUsers = async () => {
    let users = await UserModel.findAll();
    if(!users)
        throw Error('Users not found');
    else 
        return users;
};

module.exports.getUserById = async (id) => {
    let user = await UserModel.findByPk(id);
    if(!user)
        throw Error('User not found');
    else 
        return user;
};

module.exports.createUserByUserNameAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        UserModel.register(username, password, (err, user) => {
            if (err !== null) 
                reject(err);
            else 
                resolve(user);
        });
    });
};
