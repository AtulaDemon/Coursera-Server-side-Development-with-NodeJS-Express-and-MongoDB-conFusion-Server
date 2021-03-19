const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const dishSchema = new Schema({
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
    category: {
        type: String,
        require: true  
    },
    label: {
        type: String,
        default: ''  
    },
    price: {
        type: Currency,
        require: true,
        min: 0
    },
    feature: {
        type: Boolean,
        default: false  
    }
},{
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;