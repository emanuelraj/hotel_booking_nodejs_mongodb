let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
//let bcrypt = require('bcryptjs');

let User = require('../model/user');

//let jwt = require('jsonwebtoken');

let config = require('config');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

let VerifyToken = require('../auth/VerifyToken');


router.get('/getUserDetails', VerifyToken, function(req, res){
    if(req.body.user_role){
        User.find({},function(err, users){
            if(err){
                return res.status(401).json({message : err});
            }
            return res.status(200).json({auth : true, user_details : users ,message : "User Logged In Successfully"});
        });
    }
});

router.post('/makeAdmin', VerifyToken, function(req, res){
    if(req.body.user_role){
        User.findOneAndUpdate({_id : req.body.to_be_updated_user_id}, {is_admin : true},function(err, user){
            if(err){
                return res.status(401).json({message : err});
            }
            //console.log(user);
            return res.status(200).json({message: "User Role Updated"});
        });
    }else{
        return res.status(500).json({auth: false, message: "Not An Authorized User"});
    }
});

module.exports = router;

