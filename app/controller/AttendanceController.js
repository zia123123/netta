const { attendance,checkin } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize")
const authConfig = require('../../config/auth');
const apiResponse = require("../helpers/apiResponse");
const randomstring = require("randomstring");
const xl = require('excel4node');

module.exports = {


    async create(req, res) { 
        let result = await attendance.create({
            qrcode: randomstring.generate(10),
            eventId: req.body.eventId,
            name: req.body.name,
            email: req.body.email,
            notelp: req.body.notelp,
            status: false
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

      async checkin(req, res) { 
        let attendances = attendance.findOne({
            where: {
                qrcode: req.body.qrcode
            },
        }).then(attendances => {
            if(attendances.status == true || attendances.eventId != req.body.eventId){
                return apiResponse.validationErrorWithData(res, "User Sudah Melakukan Checkin!/Tidak terdaftar");
            }else{
            attendances.status = true;
            attendances.save()
            let result = checkin.create({ 
                name: attendances.name,
                eventId: req.body.eventId
             }).then(result =>{
                result.save()
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            })
            }
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },




    async find(req, res, next) {
        let result = await attendance.findByPk(req.params.id);
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },

    
    async findByIdEvent(req, res, next) {
        let result = await attendance.findAll({
            where: {
                eventId: req.query.eventId
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
        });
    },

    async excelEvent(req, res, next) {
        let result = await attendance.findAll({
            where: {
                eventId: req.query.eventId
            },
            attributes: ['name','notelp','qrcode','status'],

        }).then(result => { 
            class Transaksi {
                constructor(
                    name,
                    notelp,
                    qrcode,
                    status
                ) {
                  this.name = name; //1
                  this.notelp = notelp; //2
                  this.qrcode = qrcode; //3
                  this.status = status; //4
                }
              }
            var  CheckinArray = [];
            for(var i=0;i<result.length;i++){
                CheckinArray.push(new Transaksi(
                    result[i].name, 
                    result[i].notelp,
                    result[i].qrcode,
                    result[i].status,
                ));
            }
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Checkin');
            const headingColumnNames = [
                "name",
                "notelp",
                "qrcode",
                "status",
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            CheckinArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-checkin.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
        });
    },

    async findByName(req, res, next) {
        let email = req.query.status
        let name = req.query.name
        let notelp = req.query.notelp

        if( email == null ){
            email = ""
        }
        if( name == null ){
            name = ""
        }
        if( notelp == null ){
            notelp = ""
        }
        let result = await attendance.findAll({
            where: {
                eventId: req.query.eventId,
                [Op.and]: [
                    {
                        email: {    
                        [Op.like]: '%'+email+'%'
                      }
                     },
                     {
                        name: {    
                            [Op.like]: '%'+name+'%'
                        }
                    },
                     {
                        notelp: {    
                            [Op.like]: '%'+notelp+'%'
                        }
                        
                    }
                  ],
            },
            order: [
                ['name', 'ASC'],
            ],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
        });
    },

    async getlog(req, res, next) {
        let result = await checkin.findAll({
            where: {
                eventId: req.query.eventId
            },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
        });
    },

    async jumlah(req, res) {
        let status = req.query.status
        if( status === 'true'){
            status = true
        }else if(status === 'false'){
            status = false
        }else{
        status = "%%"
        }
        let result = await attendance.count({
            where: {
                status:status,
                eventId: req.query.eventId,
            
        }}).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async index(req, res) {
        let result = await attendance.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        req.result.status = req.body.status;
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },


}