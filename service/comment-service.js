const db = require('../models');
const CommentModel = db.comment;

module.exports.getAllComments = async () => {
    let comments = await CommentModel.findAll({include: 'author'});
    if(!comments)
        throw Error('Comments not found');
    else 
        return comments;
};

module.exports.createComment = async (comment) => {
    comment = await CommentModel.create(comment, { 
        fields: ['rating', 'comment', 'authorId', 'dishId'] 
    });
    if(!comment)
        throw Error('Cannot create new comment');
    else 
        return comment;
};