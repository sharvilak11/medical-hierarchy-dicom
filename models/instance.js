/**
 * Created by Sharvilak on 21-03-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

   instanceNumber: {type:Number,required:true},
   instancePath: {type:String,required:true}

});

module.exports = mongoose.model('Instance',schema);