/**
 * Created by Sharvilak on 21-03-2017.
 */
var Patient = require('../models/patient');
var Study = require('../models/study');
var Series = require('../models/series');
var Instance = require('../models/instance');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/medical');

var patients = [
    new Patient({
        patientId: 101110,
        patientBirthDate : '1993-08-31',
        patientSex : 'M',
        study:new Study({
            studyId: '254452',
            studyDate : '2017-01-01',
            studyName : 'Fingers Bone',
            referingPhysicianName : '',
            institutionName :  '198473',
            series: new Series({
                seriesNumber: 1,
                status : '',
                bodyPartExamined :'Arm',
                contrastBolusAgent : '',
                modality :  'CR',
                operatorsName :  'RAYOSX',
                protocolName :  'Fingers Bone'  ,
                stationName: 'CS-2',
                instance: new Instance({
                    instanceNumber: 1,
                    instancePath: 'bmode.dcm'
                })
            })
        })
    })
];
var done=0;
for(var i=0;i<patients.length;i++)
{
    patients[i].save(function(err,result){
        done++;
        if(done===patients.length){
            exit();
        }
    });
}
var exit=function() {
    mongoose.disconnect();
}
