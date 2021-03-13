const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true  
    },
    designation: {
        type: String,
        default: ''  
    },
    abbr: {
        type: String,
        default: ''  
    },
    feature: {
        type: Boolean,
        default: false  
    },
},{
    timestamps: true
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;