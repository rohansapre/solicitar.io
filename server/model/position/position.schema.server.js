/**
 * Created by rohansapre on 4/4/17.
 */
var mongoose = require('mongoose');
var positionSchema = mongoose.Schema({
    _recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    location: String,
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'position'});

module.exports = positionSchema;