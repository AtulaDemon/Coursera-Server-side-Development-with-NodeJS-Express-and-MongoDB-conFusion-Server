const db = require('../models');
const LeaderModel = db.leader;

module.exports.getAllLeaders = async () => {
    let leaders = await LeaderModel.findAll();
    if(!leaders)
        throw Error('Leaders not found');
    else 
        return leaders;
};

module.exports.getLeaderById = async (id) => {
    let leader = await LeaderModel.findByPk(id);
    if(!leader)
        throw Error('Leader not found');
    else 
        return leader;
};

module.exports.createLeader = async (leader) => {
    leader = await LeaderModel.create(leader);
    if(!leader)
        throw Error('Cannot create new leader');
    else 
        return leader;
};

module.exports.updateLeaderWithId = async (leader, id) => {
    return await LeaderModel.update(leader, {
        where: { id: id }
    });
};

module.exports.deleteAllLeaders = async () => {
    return await LeaderModel.destroy({
        where: {},
        truncate: false
    });
};

module.exports.deleteLeaderWithId = async (id) => {
    return await LeaderModel.destroy({
        where: {id: id},
        truncate: false
    });
};