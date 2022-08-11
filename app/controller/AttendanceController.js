const { attendance,checkin } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize")
const authConfig = require('../../config/auth');
const apiResponse = require("../helpers/apiResponse");
const randomstring = require("randomstring");

module.exports = {


    async create(req, res) { 
        let result = await attendance.create({
            qrcode: randomstring.generate(10),
            eventId: req.body.eventId,
            name: req.body.name,
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