const express = require('express');
const router = express.Router();
const mime = require('mime-types');


// Middlewares
const authtoken = require('./policy/Policy');

//


const EventController = require('./controller/EventController');
const AttendanceController = require('./controller/AttendanceController');



const multer = require('multer')
var multerGoogleStorage = require("multer-cloud-storage");
var uploadHandler = multer({
  storage:  multerGoogleStorage.storageEngine({
    autoRetry: true,
    //contentType: "image/png",
    bucket: 'ethos-kreatif-app.appspot.com',
    projectId: 'ethos-kreatif-app',
    keyFilename: 'ethos-firestore-key.json',
    filename: function(req, file, next){
        const ext = file.mimetype.split('/')[1]
        next(null, file.fieldname+ '-' +Date.now()+ '.' +ext)
    }
  })
});
const multerConf = {
    storage: multer.diskStorage({
        destination : function(req,file, next){
            next(null,'./app/public/images')
        },
        filename: function(req, file, next){
            const ext = file.mimetype.split('/')[1]
            next(null, file.fieldname+ '-' +Date.now()+ '.' +ext)
        }
    }),
    Filefilter: function(req,file,next){
        if(!file){
            next()
        }
        const image = file.mimetype.startsWidth('images/')
        if(image){
            next(null,true)
        }else{
            next({
                message: "File Not Supported"
            }, false)
        }
    }
};

//province
router.post('/api/event/create', EventController.signupUser);
router.post('/api/login/', EventController.signInUser);
router.get('/api/event/', EventController.index);
router.get('/api/event/:id', EventController.find, EventController.show);
router.patch('/api/event/update/:id', EventController.find,EventController.update);

//province
router.post('/api/attendance/create',authtoken, AttendanceController.create);
router.post('/api/login/', EventController.signInUser);
router.get('/api/attendance/event/', AttendanceController.findByIdEvent);
router.post('/api/checkin',authtoken, AttendanceController.checkin);
router.get('/api/log/',authtoken, AttendanceController.getlog);
router.get('/api/attendance/',authtoken, AttendanceController.index);
router.get('/api/attendance/count/',authtoken, AttendanceController.jumlah);


router.get('/api/attendance/find/',authtoken, AttendanceController.findByName);

router.get('/api/attendance/getexcel/',authtoken, AttendanceController.findByName);




router.get('/api/event/:id', EventController.find, EventController.show);
router.patch('/api/attendance/update/:id',authtoken, AttendanceController.find, AttendanceController.update);



module.exports = router;
