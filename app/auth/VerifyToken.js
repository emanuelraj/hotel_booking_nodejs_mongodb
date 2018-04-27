var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('config');
var VerifyToken = express.Router();


VerifyToken.use(function(req, res, next){
    var token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).json({auth: false, message: "No Token"});
    }

    jwt.verify(token, config.secret, function(err, decoded){
        if(err){
            return res.status(500).json({auth: false, message: "Not An Authorized User"});
        }

        req.body.user_id = decoded.user_id;
        req.body.user_email = decoded.user_email;
        req.body.user_role = decoded.user_role;
        next();
    });
});

module.exports = VerifyToken;