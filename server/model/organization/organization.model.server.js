/**
 * Created by rohansapre on 3/22/17.
 */
var mongoose = requrire('mongoose');
var q = require('q');
var organizationSchema = require('./organization.schema.server');
var organizationModel = mongoose.model('Organization', organizationSchema);

module.exports = organizationModel;