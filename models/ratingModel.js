const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'service'
    },
    noOfStars: {
        type: Number,
        default: 0
    }

}, { timestamp: true })


module.exports = mongoose.model('Rating', ratingSchema);