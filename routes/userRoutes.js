const router = require('express').Router();
const services = require('../services/userServices')
console.log("userRoutes....................")

var constant = require('../constant/constant');
var constantAR = require('../constant/constantAR');
var constantEN = require('../constant/constant');


var cm = require("../model/comman_model");
var my = require("../model/mymodel");
//Signup
console.log("1");
router.post('/signup',
    async(req, res) => {
        try {
            console.log("2");
            if (req.body.email_id) {
                console.log("3");
                if (req.body.signup_type == 0) {
                    console.log("4");
                    var msg = constant.VERIFICATION_MAIL + req.body.otp + "." + constant.EMAIL_SIGNATURE;
                    my.sendmail(req.body.email_id, constant.REG_SUB, msg);
                    let newData = await services.userSignup();
                    console.log("5");
                    if (newData) {
                        console.log("6");
                        return res.status(200).json({
                            statusCode: 200,
                            message: "Signup successful",
                            data: newData
                        })
                    } else {
                        console.log("7");
                        return res.status(200).json({
                            statusCode: 403,
                            message: "User already registered",
                            data: {}
                        })
                    }
                }
                console.log("8");
                var msg = constant.WELCOME_EMAIL + constant.EMAIL_SIGNATURE;
                my.sendmail(req.body.email_id, constant.REG_SUB, msg, function() {

                });
            }
            console.log("9");
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Signup unsuccessful",
                data: {}
            })
        }
    })

module.exports = router;