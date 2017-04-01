/**
 * Created by Sharvilak on 21-03-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    seriesNumber: {type:Number,required:true},
    status : {type:String, required:false},
    bodyPartExamined :{type:String,required:true},
    contrastBolusAgent : {type:String,required:false},
    modality :  {type:String,required:true},
    operatorsName :  {type:String,required:true},
    protocolName :  {type:String,required:true},
    stationName: {type:String,required:true},
    instance: {type:Object,required:true}

});

module.exports = mongoose.model('Series',schema);