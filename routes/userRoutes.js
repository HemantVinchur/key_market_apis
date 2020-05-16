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
                    let newData = await services.userSignup(req, res);
                    console.log("5");
                    console.log(newData);
                    if (newData) {
                        console.log("6");
                        return res.send({
                            "status": 1,
                            "message": constant.USER_REGISTER,
                            "data": newData.userData[0]
                        });
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

function errorLog(res, status, err) {
    res.send({
        "status": status,
        "message": err

    });
}

router.post('/changeEmail',
    async(req, res) => {
        try {

            console.log("1");
            if (!req.body.pub_id || !req.body.email_id) {
                console.log("2");
                res.json({
                    status: 0,
                    message: constant.CHKAllFIELD
                });
                return;
            } else {
                console.log("3");
                let newData = await services.changeEmail(req, res);
                console.log(newData);
                if (newData) {
                    console.log("4");
                    return res.send({
                        "status": 1,
                        "message": constant.PROFILE_UPDATED,
                        "data": newData
                    });
                } else {
                    errorLog(res, 0, constant.EMAIL_VALIDATION);
                }
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Email does not changed",
                data: {}
            })
        }
    })

router.post('/sendOtp',
    async(req, res) => {
        try {
            let newData = await services.sendOtp(req, res);
            if (newData == "success") {
                console.log("4");
                return res.send({
                    "status": 1,
                    "message": constant.OTP_SEND_SUCCESS,
                    "data": newData
                });
            } else if (newData == "validation") {
                console.log("4");
                return res.send({
                    "status": 1,
                    "message": constant.EMAIL_VALIDATION,
                    "data": newData
                });
            } else if (newData == "register") {
                console.log("4");
                return res.send({
                    "status": 1,
                    "message": constant.USER_ALRD_RGST,
                    "data": newData
                });
            } else {
                res.send({
                    "status": 0,
                    "message": constant.EMAIL_VALIDATION
                });
                return;
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "OTP does not send",
                data: {}
            })
        }
    })

router.post('/changeMobileNo',
    async(req, res) => {
        try {
            if (!req.body.user_pub_id || !req.body.country_code || !req.body.mobile_number) {
                res.json({
                    status: 0,
                    message: constant.CHKAllFIELD
                });
                return;
            } else {

                let newData = await services.changeMobileNo(req, res);
                if (newData) {
                    console.log("4");
                    return res.send({
                        "status": 1,
                        "message": constant.PROFILE_UPDATED,
                        "data": newData
                    });
                } else {
                    errorLog(res, 0, constant.USER_ALRD_RGST);
                }
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Mobile no. does not change",
                data: {}
            })
        }
    })


router.get('/guestSignIn',
    async(req, res) => {
        try {

            let newData = await services.guestSignIn(req, res);
            if (newData) {
                console.log("4");
                return res.send({
                    "status": 1,
                    "message": constant.PROFILE_UPDATED,
                    "data": newData
                });
            } else {
                errorLog(res, 0, constant.USER_ALRD_RGST);
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Signup unsuccessful",
                data: {}
            })
        }
    });

module.exports = router;