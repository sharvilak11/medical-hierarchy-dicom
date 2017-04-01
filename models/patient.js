/**
 * Created by Sharvilak on 20-03-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    patientId: {type:Number,required:true},
    patientBirthDate : {type:String, required:true},
    patientSex : {type:String,required:true},
    study:  {type:Object,required:true}

});

module.exports = mongoose.model('Patient',schema);