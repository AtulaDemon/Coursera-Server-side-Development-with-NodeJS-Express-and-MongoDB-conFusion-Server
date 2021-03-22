const express = require('express');

const passportUsage = require('../authentication/passport-usage');
const leaderService = require('../service/leader-service');
const cors = require('../utils/cors');

const leaderRouter = express.Router();

leaderRouter.use(express.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req, res, next) => {
    try {
        const leaders = await leaderService.getAllLeaders();
        res.statusCode = 200;
        res.json(leaders);
    } catch (err) {
        next(err);
    }
})
.post(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    let leader = req.body;
    if(!leader) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    try {
        leader = await leaderService.createDish(leader);
        res.statusCode = 200;
        res.json(leader);
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    try {
        await leaderService.deleteAllLeaders();
        if (num > 0) {
            res.statusCode = 200;
            res.end("Delete all leaders successfully.");
        } else {
            res.statusCode = 500;
            res.end("Cannot delete all leaders!");
        }
    } catch (err) {
        next(err);
    }
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req,res,next) => {
    const id = req.params.leaderId;
    try {
        leader = await leaderService.getLeaderById(id);
        res.statusCode = 200;
        res.json(leader);
    } catch (err) {
        next(err);
    }
})
.put(cors.corsWithOptions, passportUsage.verifyAdmin, async (req,res,next) => {
    let leader = req.body;
    const id = req.params.leaderId;
    if(!leader) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    try {
        const num = await leaderService.updateLeaderWithId(leader, id);
        if (num == 1) {
            res.statusCode = 200;
            res.end("Leader updated successfully.");
        } else {
            res.statusCode = 500;
            res.end(`Cannot update Leader with id=${id}. Maybe Leader was not found!`);
        }
    } catch (err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, passportUsage.verifyAdmin, async (req, res, next) => {
    const id = req.params.leaderId;
    try {
        const num = await leaderService.deleteLeaderWithId(id);
        if (num == 1) {
            res.statusCode = 200;
            res.end("Leader delete successfully.");
        } else {
            res.statusCode = 500;
            res.end(`Cannot delete Leader with id=${id}. Maybe Leader was not found!`);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = leaderRouter;