/**
 * Created by rohansapre on 3/24/17.
 */
var mongoose = require('mongoose');
var calendarSchema = mongoose.Schema({
    _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position'},
    startTime: [Date],
    endTime: [Date]
}, {collection: 'calendar'});

module.exports = calendarSchema;