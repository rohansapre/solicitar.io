/**
 * Created by rohansapre on 3/31/17.
 */
var mongoose = require('mongoose');
var prog_languages = ['Python', 'Java', 'C++'];
var firepadSchema = mongoose.Schema({
    firebaseID: String,
    languageID: String,
    language: {type: String, enum: prog_languages},
    dateCreated: { type: Date, default: Date.now() }
}, {collection: 'firepad'});

module.exports = firepadSchema;