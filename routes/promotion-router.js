const express = require('express');

const passportUsage = require('../authentication/passport-usage');
const promotionService = require('../service/promotion-service');
const cors = require('../utils/cors');

const promotionRouter = express.Router();

promotionRouter.use(express.json());

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req, res, next) => {
    try {
        const promotions = await promotionService.getAllPromotions();
        res.statusCode = 200;
        res.json(promotions);
    } catch (err) {
        next(err);
    }
})
.post(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    let promotion = req.body;
    if(!promotion) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    try {
        promotion = await promotionService.createDish(promotion);
        res.statusCode = 200;
        res.json(promotion);
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    try {
        await promotionService.deleteAllPromotions();
        if (num > 0) {
            res.statusCode = 200;
            res.end("Delete all promotions successfully.");
        } else {
            res.statusCode = 500;
            res.end("Cannot delete all promotions!");
        }
    } catch (err) {
        next(err);
    }
});

promotionRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req,res,next) => {
    const id = req.params.promotionId;
    try {
        promotion = await promotionService.getPromotionById(id);
        res.statusCode = 200;
        res.json(promotion);
    } catch (err) {
        next(err);
    }
})
.put(cors.corsWithOptions, passportUsage.verifyAdmin, async (req,res,next) => {
    let promotion = req.body;
    const id = req.params.promotionId;
    if(!promotion) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    try {
        const num = await promotionService.updatePromotionWithId(promotion, id);
        if (num == 1) {
            res.statusCode = 200;
            res.end("Promotion updated successfully.");
        } else {
            res.statusCode = 500;
            res.end(`Cannot update Promotion with id=${id}. Maybe Promotion was not found!`);
        }
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    const id = req.params.promotionId;
    try {
        const num = await promotionService.deletePromotionWithId(id);
        if (num == 1) {
            res.statusCode = 200;
            res.end("Promotion delete successfully.");
        } else {
            res.statusCode = 500;
            res.end(`Cannot delete Promotion with id=${id}. Maybe Promotion was not found!`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = promotionRouter;