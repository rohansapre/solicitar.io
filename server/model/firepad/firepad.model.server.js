/**
 * Created by rohansapre on 4/12/17.
 */
var mongoose = require('mongoose');
var q = require('q');
mongoose.Promise = q.Promise;
var firepadSchema = require('./firepad.schema.server');
var firepadModel = mongoose.model('Firepad', firepadSchema);

firepadModel.createFirepad = createFirepad;

module.exports = firepadModel;

function createFirepad(firepad) {
    return firepadModel.create(firepad);
}