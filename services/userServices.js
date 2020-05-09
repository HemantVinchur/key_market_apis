var constant = require('../constant/constant');
var qr = require('qr-image');
var fs = require('fs');
var path = require('path');
var msg91 = require('msg91-sms');
var _ = require('lodash');
var base_url = "http://172.105.54.245/admin/";
var request = require('request');
var msg91 = require("msg91")("205521Ay0uGpRMiR5da996d7", "KEYIND", "4");


const userSignup = async() => {
    try {
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString(16);
        var str = crypto.createHash('sha1').update(random + current_date).digest('hex');
        var pub_id = str;
        if (req.body.email_id) {
            var email_id = req.body.email_id;
            var current_date = (new Date()).valueOf().toString();
            var username = email_id.split('@');
            var user_name = username[0] + current_date;
            cm.getallDataWhere('user', {
                email_id: req.body.email_id
            }, function(err, result) {
                if (err) {

                } else {
                    if (result.length == 0) {
                        var code = qr.image(pub_id, {
                            type: 'png',
                            ec_level: 'H',
                            size: 10,
                            margin: 0
                        });
                        var ss = path.join('../../../../../var/www/html/admin/assets/barcode_image/', pub_id + '.png');
                        var output = fs.createWriteStream(ss);
                        code.pipe(output);
                        var qr_image = "/assets/barcode_image/" + pub_id + ".png"

                        var userdata = {
                            pub_id: pub_id,
                            email_id: req.body.email_id,
                            user_name: user_name,
                            name: user_name,
                            signup_type: req.body.signup_type,
                            QR_image: qr_image,
                            device_token: req.body.device_token,
                            device_type: req.body.device_type,
                            created_at: (new Date()).valueOf().toString(),
                            updated_at: (new Date()).valueOf().toString(),
                            signup_at: (new Date()).valueOf().toString()
                        };
                        delete req.body.language;
                        cm.insert('user', userdata, function(err, result) {
                            cm.getallDataWhere('user', {
                                pub_id: pub_id
                            }, function(err, userData) {
                                if (userData.length > 0) {
                                    userData[0].profile_image = base_url + userData[0].profile_image;
                                    userData[0].QR_image = base_url + userData[0].QR_image;
                                }

                                res.send({
                                    "status": 1,
                                    "message": constant.USER_REGISTER,
                                    "data": userData[0]
                                });
                            });
                        });
                    } else {
                        cm.getallDataWhere('user', {
                            email_id: req.body.email_id
                        }, function(err, userData) {
                            if (userData.length > 0) {
                                userData[0].QR_image = base_url + userData[0].QR_image;
                                userData[0].profile_image = base_url + userData[0].profile_image;

                                if (userData[0].QR_image == "") {
                                    var code = qr.image(userData[0].pub_id, {
                                        type: 'png',
                                        ec_level: 'H',
                                        size: 10,
                                        margin: 0
                                    });
                                    var ss = path.join('../../../../../var/www/html/admin/assets/barcode_image/', pub_id + '.png');
                                    var output = fs.createWriteStream(ss);
                                    code.pipe(output);
                                    var qr_image = "/assets/barcode_image/" + userData[0].pub_id + ".png"

                                    userData[0].QR_image = base_url + qr_image;
                                    cm.update('user', {
                                        email_id: req.body.email_id
                                    }, {
                                        QR_image: qr_image,
                                    }, function(err, updateresult) {});
                                }

                                if (userData[0].user_name == "") {
                                    userData[0].user_name = user_name;
                                    cm.update('user', {
                                        email_id: req.body.email_id
                                    }, {
                                        user_name: user_name,
                                    }, function(err, updateresult) {});
                                }

                                cm.update('user', {
                                    email_id: req.body.email_id
                                }, {
                                    device_token: req.body.device_token,
                                    device_type: req.body.device_type,
                                }, function(err, updateresult) {});
                            }

                            res.send({
                                "status": 1,
                                "message": constant.USER_REGISTER,
                                "data": userData[0]
                            });
                        });
                    }
                }
            });
        }

        if (req.body.mobile_number) {
            if (req.body.country_code == "91") {
                var senderId = "KEYIND";
            } else {
                var senderId = "KEYMARKTOTP";
            }

            var msg = "Use " + req.body.otp + constant.VERIFICATION_MSG;
            var number = req.body.country_code + req.body.mobile_number;
            var user_name = req.body.country_code + req.body.mobile_number + 'KMUser';

            if (req.body.country_code == "91") {
                msg91.send(number, msg, function(err, response) {
                    //console.log(response);
                });
            } else {
                request({
                    uri: "http://www.oursms.net/api/sendsms.php?username=keymarket&password=Khts@1397&message=" + msg + "&numbers=" + number + "&sender=" + senderId + "&unicode=e&Rmduplicated=1&return=json",
                    method: "GET",
                    form: 'test'
                }, function(error, response, body) {});
            }

            /*        request({
                        uri: "http://www.oursms.net/api/sendsms.php?username=keymarket&password=K12345678&message=" + msg + "&numbers=" + number + "&sender=" + senderId + "&unicode=e&Rmduplicated=1&return=json",
                        method: "GET",
                        form: 'test'
                    }, function(error, response, body) {});*/

            cm.getallDataWhere('user', {
                mobile_number: req.body.mobile_number,
                country_code: req.body.country_code
            }, function(err, userResult) {
                if (userResult.length == 0) {

                    var code = qr.image(pub_id, {
                        type: 'png',
                        ec_level: 'H',
                        size: 10,
                        margin: 0
                    });
                    var ss = path.join('../../../../../var/www/html/admin/assets/barcode_image/', pub_id + '.png');
                    var output = fs.createWriteStream(ss);
                    code.pipe(output);
                    var qr_image = "/assets/barcode_image/" + pub_id + ".png"
                    var userdata = {
                        pub_id: pub_id,
                        user_name: user_name,
                        name: user_name,
                        mobile_number: req.body.mobile_number,
                        QR_image: qr_image,
                        signup_type: req.body.signup_type,
                        country_code: req.body.country_code,
                        device_token: req.body.device_token,
                        device_type: req.body.device_type,
                        created_at: (new Date()).valueOf().toString(),
                        updated_at: (new Date()).valueOf().toString(),
                        signup_at: (new Date()).valueOf().toString()
                    };

                    cm.insert('user', userdata, function(err, result) {
                        cm.getallDataWhere('user', {
                            pub_id: pub_id
                        }, function(err, userData) {
                            if (userData.length > 0) {
                                userData[0].QR_image = base_url + userData[0].QR_image;
                                userData[0].profile_image = base_url + userData[0].profile_image;
                            }

                            res.send({
                                "status": 1,
                                "message": constant.USER_REGISTER,
                                "data": userData[0]
                            });
                        });
                    });
                } else {
                    cm.getallDataWhere('user', {
                        mobile_number: req.body.mobile_number,
                        country_code: req.body.country_code,
                    }, function(err, userData) {

                        if (userData.length > 0) {
                            userData[0].profile_image = base_url + userData[0].profile_image;
                            if (userData[0].QR_image == "") {
                                var code = qr.image(userData[0].pub_id, {
                                    type: 'png',
                                    ec_level: 'H',
                                    size: 10,
                                    margin: 0
                                });
                                var ss = path.join('../../../../../var/www/html/admin/assets/barcode_image/', pub_id + '.png');
                                var output = fs.createWriteStream(ss);
                                code.pipe(output);
                                var qr_image = "/assets/barcode_image/" + userData[0].pub_id + ".png"

                                cm.update('user', {
                                    mobile_number: req.body.mobile_number,
                                    country_code: req.body.country_code,
                                }, {
                                    QR_image: qr_image,
                                }, function(err, updateresult) {});
                                userData[0].QR_image = base_url + qr_image;
                            }

                            if (userData[0].user_name == "") {
                                cm.update('user', {
                                    mobile_number: req.body.mobile_number,
                                    country_code: req.body.country_code,
                                }, {
                                    user_name: user_name,
                                }, function(err, updateresult) {});

                                userData[0].user_name = user_name;
                            }

                            cm.update('user', {
                                mobile_number: req.body.mobile_number,
                                country_code: req.body.country_code,
                            }, {
                                device_token: req.body.device_token,
                                device_type: req.body.device_type,
                            }, function(err, updateresult) {});

                            userData[0].QR_image = base_url + userData[0].QR_image;
                        }

                        res.send({
                            "status": 1,
                            "message": constant.USER_REGISTER,
                            "data": userData[0]
                        });
                    });
                }
            });
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = { userSignup }