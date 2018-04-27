let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let request = require('request');

let jwt = require('jsonwebtoken');

let config = require('config');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

let VerifyToken = require('../auth/VerifyToken');

router.get('/getHotelDetails', VerifyToken, function(req, res){
    console.log(req.user_id);
    console.log(req.user_role);
    var options = { method: 'GET',
        url: 'https://api.myjson.com/bins/tl0bp',
        headers: { 'content-type': 'application/x-www-form-urlencoded' } 
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.status(200).json({hotel_details : body, message: "Hotel Details"});
    });

});

router.post('/search', VerifyToken, function(req, res){
    var options = { method: 'GET',
        url: 'https://api.myjson.com/bins/tl0bp',
        headers: { 'content-type': 'application/x-www-form-urlencoded' } 
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        let response_body = JSON.parse(body);
        
        function search(query) { 
            return function(element) {
                for(let i in query) {
                    let str = true;
                    if(i == 'price') {
                        s = query[i].split(":")[0].slice(1);
                        l = query[i].split(":")[1].slice(1);
                        str = !(element[i] > parseFloat(s) && element[i] < parseFloat(l));
                    }

                    let date_status = [];
                    if(i == 'availability'){
                        from = query[i].split(":")[0];
                        to = query[i].split(":")[1];
                        for(let j = 0; j < element[i].length; j++){
                            date_status.push((changeDateFormat(from) >= changeDateFormat(element[i][j]["from"]) && changeDateFormat(to) <= changeDateFormat(element[i][j]["to"])));
                        }
                    }
                    
                    let date_status_check = true;
                    if(date_status.indexOf(true) != -1){
                        date_status_check = false;
                    }

                    function changeDateFormat(date_string){
                        date_string = date_string.split("-");
                        return new Date(date_string[2], date_string[1]-1, date_string[0]);
                    }
                    
                    if(element[i].toString().indexOf(query[i]) == -1 && str && date_status_check) {
                         return false; 
                    } 
                }  
                return true; 
            } 
        } 
        
        hotel_details = response_body.hotels.filter(search(req.body)); 
        
        res.status(200).json({hotel_details : hotel_details, message: "Hotel Details"});
    });

});


router.post('/sort', VerifyToken, function(req, res){
    if(req.body.user_role){
        var options = { method: 'GET',
            url: 'https://api.myjson.com/bins/tl0bp',
            headers: { 'content-type': 'application/x-www-form-urlencoded' } 
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            let response_body = JSON.parse(body);
            
            response_body.hotels.sort(function (a, b) {
                return a[req.body.sort_by] > b[req.body.sort_by];
            });
            
            res.status(200).json({hotel_details : response_body.hotels, message: "Sorted Hotel Details"});
        });
    }else{
        return res.status(500).json({auth: false, message: "Not An Authorized User"});
    }

});

module.exports = router;
