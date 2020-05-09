const router = require('express').Router();
const services = require('../services/userServices')
console.log("userRoutes....................")

var constant = require('../constant/constant');
var constantAR = require('../constant/constantAR');
var constantEN = require('../constant/constant');
//Signup

router.post('/signup',
    async(req, res) => {
        try {
            if (req.body.email_id) {
                if (req.body.signup_type == 0) {
                    var msg = constant.VERIFICATION_MAIL + req.body.otp + "." + constant.EMAIL_SIGNATURE;
                    my.sendmail(req.body.email_id, constant.REG_SUB, msg);
                    let newData = await services.userSignup(payLoad);
                    if (newData) {
                        return res.status(200).json({
                            statusCode: 200,
                            message: "Signup successful",
                            data: newData
                        })
                    } else {
                        return res.status(200).json({
                            statusCode: 403,
                            message: "User already registered",
                            data: {}
                        })
                    }
                }
                var msg = constant.WELCOME_EMAIL + constant.EMAIL_SIGNATURE;
                my.sendmail(req.body.email_id, constant.REG_SUB, msg, function() {

                });
            }
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