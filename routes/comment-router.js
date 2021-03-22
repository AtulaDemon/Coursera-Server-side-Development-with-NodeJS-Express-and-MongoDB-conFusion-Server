const express = require('express');

const passportUsage = require('../authentication/passport-usage');
const CommentService = require('../service/comment-service');
const cors = require('../utils/cors');

const commentRouter = express.Router();

commentRouter.use(express.json());

commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200); 
})
.get(cors.cors, async (req, res, next) => {
    try {
        const comments = await CommentService.getAllComments();
        res.statusCode = 200;
        res.json(comments);
    } catch (err) {
        next(err);
    }
})
.post(cors.corsWithOptions, passportUsage.verifyUser, async (req, res, next) => {
    let comment = req.body;
    if(!comment) {
        res.statusCode = 400;
        res.end('Content can not be empty');
    }
    comment.authorId = req.user.id;
    comment.dishId = comment.dish;
    try {
        comment = await CommentService.createComment(comment);
        res.statusCode = 200;
        res.json(comment);
    } catch (err) {
        next(err);
    }
})

module.exports = commentRouter;