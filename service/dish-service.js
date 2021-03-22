const db = require('../models');
const DishModel = db.dish;

module.exports.getAllDishes = async () => {
    let dishes = await DishModel.findAll();
    if(!dishes)
        throw Error('Dishes not found');
    else 
        return dishes;
};

module.exports.getDishById = async (id) => {
    let dish = await DishModel.findByPk(id);
    if(!dish)
        throw Error('Dish not found');
    else 
        return dish;
};

module.exports.createDish = async (dish) => {
    dish = await DishModel.create(dish, { 
        fields: ['name', 'description', 'image', 'category', 'price', 'feature'] 
    });
    if(!dish)
        throw Error('Cannot create new dish');
    else 
        return dish;
};

module.exports.updateDishWithId = async (dish, id) => {
    return await DishModel.update(dish, {
        where: { id: id }
    });
};

module.exports.deleteAllDishes = async () => {
    return await DishModel.destroy({
        where: {},
        truncate: false
    });
};

module.exports.deleteDishWithId = async (id) => {
    return await DishModel.destroy({
        where: {id: id},
        truncate: false
    });
};