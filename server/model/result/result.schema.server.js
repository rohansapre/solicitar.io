/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var resultSchema = mongoose.Schema({
    _interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
    rating: Number,
    selected: Boolean,
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'result'});

module.exports = resultSchema;