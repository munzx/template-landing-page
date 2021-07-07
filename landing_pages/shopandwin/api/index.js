const router = require('express').Router();
const userModel = require('./models/users');
const adminModel = require('./models/admin');
const randomstring = require("randomstring");
const mail = require('./lib/mail');


router.get('/search/:key?', (req, res, next) => {
    if(!req.params.key) return res.status(200).jsonp(null); 
    let regex = new RegExp(req.params.key,'i');
    userModel.find({ $or: [{fullname: regex }, {mobile: regex}, {nationality: regex}, {email: regex}, {randomStr: regex}]})
    .limit(10).exec((err, result) => {
        if (err) return res.status(500).jsonp(err);
        return res.status(200).jsonp(result);
    });
});

router.get('/admin/create', (req, res, next) => {
    adminModel.findOne({ access: 'admin' }, (err, info) => {
        if (err) return res.status(500).jsonp('Failed to create admin');
        if (info) return res.status(200).jsonp(true);
        let adminInfo = new adminModel({ email: "admin@dubaioutletmall.com", password: "DOM&RTT@!@#$%@123" });
        adminInfo.save((err, result) => {
            if (err) return res.status(500).jsonp('Failed to create admin');
            return res.status(200).jsonp(true);
        });
    });
});

router.get('/users/count', (req, res, next) => {
    userModel.count().exec((err, result) => {
        if (err) return res.status(500).jsonp(err);
        return res.status(200).jsonp(result);
    });
});

router.get('/users', (req, res, next) => {
    userModel.find({}, (err, result) => {
        if (err) return res.status(500).jsonp(err);
        return res.status(200).jsonp(result);
    });
});

router.get('/users/:from?', (req, res, next) => {
    let skip = req.params.from || 0;

    userModel.find({}).skip(skip).limit(20).sort("-created").exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).jsonp(err);
        }
        return res.status(200).jsonp(result);
    });
});

router.post('/users', (req, res, next) => {
    let randomStr = randomstring.generate(8);
    req.body.randomStr = randomStr;
    let newUser = new userModel(req.body);
    let userEmail = req.body.email.trim().toLowerCase();
    userModel.findOne({ email: userEmail}, function (err, checkUser) {
        if (err) {
            res.status(505).jsonp('Failed to register user');
        } else if (checkUser) {
            res.status(409).jsonp("You've already registered");
        } else {
            newUser.save(function (err, user) {
                if (err) {
                    res.status(301).jsonp({ messgage: err.message });
                } else {
                    mail(req.body.email, req.body.fullname, user.randomStr)
                        .catch(err => console.log(err));
                    res.status(200).jsonp(user);
                }
            });
        }
    });
});

router.post('/admin/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        adminModel.findOne({ email: req.body.email }, function (err, userInfo) {
            if (err) {
                res.status(401).jsonp('Access denied 1');
            } else {
                if (userInfo) {
                    userInfo.comparePasswords(req.body.password, function (err, isMatch) {
                        if (err) {
                            res.status(401).jsonp('Access denied 2');
                        }
                        if (isMatch) {
                            req.session.admin = userInfo;
                            req.session.admin.password = null;
                            res.status(200).jsonp(userInfo);
                        } else {
                            res.status(401).jsonp('Access denied 3');
                        }
                    });
                } else {
                    res.status(401).jsonp('Access denied 4');
                }
            }
        });
    } else {
        res.status(401).jsonp('Access denied 5');
    }
});

router.get('/admin/logout', (req, res, next) => {
    req.session = null
    res.status(200).jsonp(req.session);
});

router.get('/admin/islogged', (req, res, next) => {
    res.status(200).jsonp(req.session.admin);
});


module.exports = router;