/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = require('mongoose');
var organizations = ['UNIVERSITY', 'COMPANY'];
var organizationSchema = mongoose.Schema({
    name: String,
    address: String,
    type: { type: String, enum: organizations }
}, {collection: 'organization'});

module.exports = organizationSchema;