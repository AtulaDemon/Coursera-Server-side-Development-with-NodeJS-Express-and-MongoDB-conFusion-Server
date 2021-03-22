const express = require('express');

const passportUsage = require('../authentication/passport-usage');
const DishService = require('../service/dish-service');
const cors = require('../utils/cors');

const dishRouter = express.Router();

dishRouter.use(express.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req, res, next) => {
    try {
        const dishes = await DishService.getAllDishes();
        res.statusCode = 200;
        res.json(dishes);
    } catch (err) {
        next(err);
    }
})
.post(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    let dish = req.body;
    if(!dish) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    try {
        dish = await DishService.createDish(dish);
        res.statusCode = 200;
        res.json(dish);
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    try {
        await DishService.deleteAllDishes();
        if (num > 0) {
            res.statusCode = 200;
            res.end("Delete all dishes successfully.");
        } else {
            res.statusCode = 500;
            res.end("Cannot delete all dishes!");
        }
    } catch (err) {
        next(err);
    }
});

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req,res,next) => {
    const id = req.params.dishId;
    try {
        dish = await DishService.getDishById(id);
        res.statusCode = 200;
        res.json(dish);
    } catch (err) {
        next(err);
    }
})
.put(cors.corsWithOptions, passportUsage.verifyAdmin, async (req,res,next) => {
    let dish = req.body;
    const id = req.params.dishId;
    if(!dish) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    try {
        const num = await DishService.updateDishWithId(dish, id);
        if (num == 1) {
            res.statusCode = 200;
            res.end("Dish updated successfully.");
        } else {
            res.statusCode = 500;
            res.end(`Cannot update Dish with id=${id}. Maybe Dish was not found!`);
        }
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    const id = req.params.dishId;
    try {
        const num = await DishService.deleteDishWithId(id);
        if (num == 1) {
            res.statusCode = 200;
            res.end("Dish delete successfully.");
        } else {
            res.statusCode = 500;
            res.end(`Cannot delete Dish with id=${id}. Maybe Dish was not found!`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = dishRouter;