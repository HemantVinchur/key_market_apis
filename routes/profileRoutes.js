const router = require('express').Router();

var cm = require("../model/comman_model");

var constant = require('../constant/constant');
var constantAR = require('../constant/constantAR');
var constantEN = require('../constant/constant');

router.post("/viewMyProfile", function(req, res) {

    if (!req.body.user_pub_id) {
        res.json({
            status: 0,
            message: constant.CHKAllFIELD
        });
        return;
    } else {
        var final_result = [];
        cm.getallDataWhere('user', {
            pub_id: req.body.user_pub_id
        }, function(err, chkUser) {
            if (chkUser.length == 0) {
                res.send({
                    status: 0,
                    message: constant.USER_NOT_FOUND
                });
            } else {
                cm.follower(req.body.user_pub_id, function(err, follower) {

                    chkUser[0].follower = follower.length;
                    chkUser[0].profile_image = base_url + chkUser[0].profile_image;
                    chkUser[0].QR_image = base_url + chkUser[0].QR_image;
                    final_result.push(follower);
                    cm.following(req.body.user_pub_id, function(err, following) {
                        chkUser[0].following = following.length;
                        cm.getallProductDataWhere('product', {
                            user_pub_id: req.body.user_pub_id,
                            status: 1
                        }, function(err, product) {
                            chkUser[0].following = following.length;
                            chkUser[0].total_product = product.length;

                            var productArr = [];
                            var productSoldArr = [];
                            if (product.length > 0) {
                                product
                                    .reduce(function(promiesRes, productdata, index) {
                                        return promiesRes
                                            .then(function(data) {
                                                return new Promise(function(resolve, reject) {
                                                    cm.getCategoryById(req.body.language, productdata.category_pub_id, function(err, category) {

                                                        if (category.length > 0) {
                                                            productdata.category_name = category[0].category_name;
                                                        } else {
                                                            productdata.category_name = "";
                                                        }
                                                        resolve(productdata);

                                                    })
                                                })
                                            })
                                            .then(function(data) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getCategoryById(req.body.language, productdata.sub_cat_pub_id, function(err, sub_category) {
                                                        if (sub_category.length > 0) {
                                                            productdata.sub_category_name = sub_category[0].category_name;
                                                        } else {
                                                            productdata.sub_category_name = "";
                                                        }
                                                        resolve(productdata);

                                                    })
                                                })
                                            })
                                            .then(function(data) {
                                                return new Promise(function(resolve, reject) {
                                                    cm.getBrandById(req.body.language, productdata.car_brand_pub_id, function(err, car_brand) {

                                                        if (car_brand.length > 0) {
                                                            productdata.car_brand_name = car_brand[0].brand_name;
                                                        } else {
                                                            productdata.car_brand_name = "";
                                                        }
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(data) {
                                                return new Promise(function(resolve, reject) {
                                                    cm.getModelById(req.body.language, productdata.car_model_pub_id, function(err, car_model) {
                                                        if (car_model.length > 0) {
                                                            productdata.car_model_name = car_model[0].model_name;
                                                        } else {
                                                            productdata.car_model_name = "";
                                                        }
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getallDataWhere('likes_views', {
                                                        user_pub_id: req.body.user_pub_id,
                                                        product_pub_id: productdata.pub_id,
                                                        type: 1,
                                                    }, function(err, likes) {
                                                        console.log(err);

                                                        if (likes.length == 0) {
                                                            productdata.isLike = "0";
                                                        } else {
                                                            productdata.isLike = "1";
                                                        }
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getallDataWhere('comments', {
                                                        product_pub_id: productdata.pub_id
                                                    }, function(err, comments) {

                                                        productdata.getCommentsCount = comments.length;
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getallDataWhere('likes_views', {
                                                        product_pub_id: productdata.pub_id,
                                                        type: 1,
                                                    }, function(err, allLikes) {

                                                        productdata.getLikesCount = allLikes.length;
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getallDataWhere('likes_views', {
                                                        product_pub_id: productdata.pub_id,
                                                        type: 2,
                                                    }, function(err, view_result) {
                                                        productdata.getViewCount = view_result.length;
                                                        resolve(productdata);
                                                    });
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getallDataWhere('forward', {
                                                        product_pub_id: productdata.pub_id
                                                    }, function(err, forword_result) {
                                                        productdata.getForwordCount = forword_result.length;
                                                        resolve(productdata);
                                                    });
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getLikeUsers(productdata.pub_id, function(err, like_users) {

                                                        productdata.getLikesuser = like_users;
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getCommentsUsers(productdata.pub_id, function(err, commented_user) {

                                                        productdata.getCommentedUsers = commented_user;
                                                        resolve(productdata);
                                                    })
                                                })
                                            })
                                            .then(function(productdata) {

                                                return new Promise(function(resolve, reject) {
                                                    cm.getMediaDatails(productdata.pub_id, function(err, mediaData) {

                                                        productdata.media = mediaData;

                                                        if (productdata.is_sold == 0) {
                                                            productSoldArr.push(productdata);
                                                        } else {
                                                            productArr.push(productdata);
                                                        }
                                                        resolve(productdata);

                                                    })
                                                })
                                            })
                                            .catch(function(error) {
                                                console.log(' -- error: ', error);
                                                res.send({
                                                    "status": 0,
                                                    "message": constant.ERR
                                                });
                                                return error.message;
                                            })
                                    }, Promise.resolve(null)).then(arrayOfResults => { // Do something with all results

                                        chkUser[0].product = productArr.reverse();
                                        chkUser[0].sold_product = productSoldArr.reverse();
                                        res.send({
                                            "status": 1,
                                            "message": constant.PRODUCTS,
                                            "data": chkUser[0]
                                        });
                                    });
                            } else {
                                chkUser[0].product = productArr.reverse();
                                chkUser[0].sold_product = productSoldArr.reverse();
                                res.send({
                                    "status": 1,
                                    "message": constant.PRODUCTS,
                                    "data": chkUser[0]
                                });
                            }
                        });
                    });
                });
            }
        })
    }
});

module.exports = router;