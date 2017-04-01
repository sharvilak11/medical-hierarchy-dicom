var express = require('express');
var router = express.Router();
var Patient = require('../models/patient');
var url=require('url');
var daikon = require('daikon');
var fs=require('fs');
var replaceString = require('replace');
var builder = require('xmlbuilder');
var path = require('path');

/***************** Home page Route ***************************/

router.get('/', function(req, res, next) {

    res.render('index', { title: 'Dicom Server' });

});

/************* Route which routes to Search Result *************/

router.get('/search',function(req,res,next){

  var searchCriteria = req.query['txtSearch'];
  console.log(searchCriteria);

    Patient.find({'patientId': searchCriteria}, function (err, docs) {
        if(docs.length===0){
            var nofound = "Patient not found!!";
        }
        res.render('index', {patients: docs,notFound:nofound,title:'Dicom Server'});

    });

});


/*********** Route which routes to XML File ******************/
router.get('/instanceresult/:instanceNum',function(req,res,next){

    instancePath = req.query.filename;
    instanceId = req.query.id;
    console.log(instancePath);

    var str=renderXML(instancePath);
    var nofound="";
    if(!str)
    {
        nofound = "Patient not found!!";
    }
    else
    {
        fs.writeFileSync('./output/'+instanceId+'.xml',str);
    }

    res.sendFile(path.resolve(__dirname+'/../output/'+instanceId+'.xml'));
});


/*************** Parsing Functions *******************/
/*********Author : Sharvilak Thakore *****************/
/*****************************************************/

/************** Function for converting to Uint8Array ****************/

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
};

/************** Function to get raw data from the image ***************/

function getData(filename){

    daikon.Parser.verbose=true;

    var name = './public/images/'+filename;
    var data = fs.readFileSync(name);

    var imageData = daikon.Series.getDataFromImage(new DataView(toArrayBuffer(data)));

    if (imageData === null) {
        console.error('Error'+ daikon.Series.parserError);
    }
    return imageData;

};

/************** Function to get render parse data to XML ***************/

function renderXML(filename) {
    var imageData=getData(filename);
    fs.writeFileSync('./output/output.txt',imageData);

    replaceString({
        regex: '<span style=\'color:#[A-Z0-9]+\'>|&nbsp;+|[)]',
        replacement: '',
        paths: ['./output/output.txt'],
        recursive: true,
        silent: true
    });

    replaceString({
        regex: '</span>',
        replacement: '~',
        paths: ['./output/output.txt'],
        recursive: true,
        silent: true
    });


    replaceString({
        regex: '<br />',
        replacement: ';',
        paths: ['./output/output.txt'],
        recursive: true,
        silent: true
    });

    replaceString({
        regex: '[(]',
        replacement: 'Tag',
        paths: ['./output/output.txt'],
        recursive: true,
        silent: true
    });

    replaceString({
        regex: ',',
        replacement: '-',
        paths: ['./output/output.txt'],
        recursive: true,
        silent: true
    });

    var file = fs.readFileSync('./output/output.txt').toString();
    var tags = file.split(';');
    var tagnumber="";
    var tagdescription="";
    var tagvalue="";
    var root = builder.create('Instance');

    tags.forEach(function(tag){

        tag_arr = tag.split('~');
        tagnumber = tag_arr[0];

        var tagdescriptionvalue = tag_arr[1];

        if(tagdescriptionvalue) {
            var tag_desc_arr = tagdescriptionvalue.split('[');
            tagdescription = tag_desc_arr[0];

            if(tag_desc_arr[1]) {
                tagvalue = tag_desc_arr[1].substring(0, tag_desc_arr[1].length - 1);
                root.ele(tagnumber,{'description':tagdescription,'value':tagvalue}).end({pretty:true});
                console.log(tagnumber+ " "+ tagdescription + " "+ tagvalue);
            }
            else
            {
                root.ele(tagnumber,{'description':tagdescription,'value':''});
                console.log(tagnumber+ " "+ tagdescription);
            }

        }

    });
    return root.toString();
};

module.exports = router;
