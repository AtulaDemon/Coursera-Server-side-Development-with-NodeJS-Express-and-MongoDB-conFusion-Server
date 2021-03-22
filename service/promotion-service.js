const db = require('../models');
const PromotionModel = db.promotion;

module.exports.getAllPromotions = async () => {
    let promotions = await PromotionModel.findAll();
    if(!promotions)
        throw Error('Promotions not found');
    else 
        return promotions;
};

module.exports.getPromotionById = async (id) => {
    let promotion = await PromotionModel.findByPk(id);
    if(!promotion)
        throw Error('Promotion not found');
    else 
        return promotion;
};

module.exports.createPromotion = async (promotion) => {
    promotion = await PromotionModel.create(promotion);
    if(!promotion)
        throw Error('Cannot create new promotion');
    else 
        return promotion;
};

module.exports.updatePromotionWithId = async (promotion, id) => {
    return await PromotionModel.update(promotion, {
        where: { id: id }
    });
};

module.exports.deleteAllPromotions = async () => {
    return await PromotionModel.destroy({
        where: {},
        truncate: false
    });
};

module.exports.deletePromotionWithId = async (id) => {
    return await PromotionModel.destroy({
        where: {id: id},
        truncate: false
    });
};