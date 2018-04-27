let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');

let User = require('../model/user');

let jwt = require('jsonwebtoken');

let config = require('config');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));


router.post('/login', function(req, res){
    User.findOne({email_id : req.body.email_id},function(err, user){
        if(err){
            return res.status(401).json({message : err});
        }

        var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({auth : false, token : null, message : "Not Authorised User"});
        }else{

            let payload = {
                user_id : user.id,
                user_email : user.email_id,
                user_role : user.is_admin
            }

            let token = jwt.sign(payload, config.secret,{
                expiresIn : 240
            });
            
            return res.status(200).json({auth : true, token : token, message : "User Logged In Successfully"});
        }
    });
})

router.post('/register', function(req, res){
    User.find({email_id : req.body.email_id},function(err, user){
        if(err){
            return res.status(401).json({message : err});
        }
        console.log(user);
        if(user.length > 0 ){
            return res.status(200).json({message : "User Already Exists"});
        }else{
            let hashed_password = bcrypt.hashSync(req.body.password, 8);
            
            let new_user = {
                name : req.body.name,
                email_id : req.body.email_id,
                password : hashed_password
            }
            User.create(new_user, function(err, user){
                if(err){
                    return res.status(401).json({message : err});
                }

                let payload = {
                    user_id : user.id,
                    user_email : user.email_id,
                    user_role : user.is_admin
                }

                let token = jwt.sign(payload, config.secret,{
                    expiresIn : 240
                });
                
                return res.status(200).json({auth : true, token : token, message : "User Created Successfully"});
            });
        }
    });
});

module.exports = router;

