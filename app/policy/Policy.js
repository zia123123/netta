const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const { event } = require('../models/index'); 

module.exports = (req, res, next) => {
    if(!req.headers.authorization) {
        res.status(401).json({ msg: "Anda tidak memiliki akses" });
    } else {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if(err) {
                res.status(401).json({ msg: "Token sudah habis" });
            } else {
                event.findByPk(decoded.event.id).then(event => {
                    req.event = event;
                    next();
                }).catch(err => {
                    res.status(401).json({ msg: "Anda tidak memiliki akses" });

            });
            }
        })
    }

};