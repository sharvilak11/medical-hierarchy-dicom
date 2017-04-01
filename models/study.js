/**
 * Created by Sharvilak on 21-03-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    studyId: {type:Number,required:true},
    studyDate : {type:String, required:true},
    studyName :{type:String,required:true},
    referingPhysicianName : {type:String,required:false},
    institutionName :  {type:String,required:false},
    series: {type:Object,required:true}

});

module.exports = mongoose.model('Study',schema);