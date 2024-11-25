const mongoose = require('mongoose');

const nutirionSchema = new mongoose.Schema({
    id: {
        type:Number,
        required: true,
    },
    name: {
        type:String,
        required: true,
    },
    calories: {
        type:Number,
        required: true,
    },
    protein: {
        type:Number,
        required: true,
    },
    total_fat: {
        type:Number,
        required: true,
    },
    sodium: {
        type:Number,
        required: true,
    },
});


const Nutrition = mongoose.model("Nutrition", nutirionSchema);

module.exports = Nutrition;