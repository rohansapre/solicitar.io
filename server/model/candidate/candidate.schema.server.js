/**
 * Created by rohansapre on 4/3/17.
 */
var mongoose = require('mongoose');
var candidateSchema = mongoose.Schema({
    _position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position'},
    _applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'candidate'});

module.exports = candidateSchema;