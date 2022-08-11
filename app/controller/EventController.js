const { event } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth');
const apiResponse = require("../helpers/apiResponse");
const randomstring = require("randomstring");

module.exports = {


    async signupUser(req, res) { 
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds))
        let result = await event.create({
            codeEvent: randomstring.generate(7),
            password: password,
            nameEvent: req.body.nameEvent,
            status: true
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

      signInUser(req, res) {
        let { codeEvent, password } = req.body;
            event.findOne({
                where: {
                    codeEvent: codeEvent
                },
            }).then(event => {
                if (!event) {
                    res.status(404).json({ message: "Code tidak valid!" });
                } else {
                    if (bcrypt.compareSync(password, event.password)) {
                        let token = jwt.sign({ event: event }, authConfig.secret, {
                            expiresIn: authConfig.expires
                        });
                        res.json({
                            status: 200,
                            message:"SUCCESS",
                            data: event,
                            token: token
                        })
                    } else {
                        
                        res.status(401).json({ msg: "Password Salah" })
                    }
                }
            }
            ).catch(err => {
                res.status(500).json(err);
            })   
        },




    async find(req, res, next) {
        let result = await event.findByPk(req.params.id);
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },




    async index(req, res) {
        let result = await event.findAll({
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