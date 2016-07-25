var express = require('express');
var router = express.Router();
var path = require('path');
var urllib = require('urllib');

var mysql = require('mysql');
var multer  = require('multer')
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var session = require('express-session');

var config = require('../config/config');
/*var url = client.getAuthorizeURL('http://test.any-edu.com/login', 'STATE', 'snsapi_userinfo');
console.log(url);*/




/* GET home page. */
/*router.get('/', function(req, res,next) {
    if(req.session.account==undefined){
        res.redirect('/login');
    }else{
        res.sendFile(path.join(__dirname,'../views/webApp/index2.html'));
    }



   /!* if(req.cookies['sign']!='admin'){
        res.redirect('/login');
    }else{
        res.sendFile(path.join(__dirname,'../views/webApp/index2.html'));
    }*!/

   /!* console.log('test');
    res.sendFile(path.join(__dirname,'../views/webApp/index.html'))*!/
    //res.render('index', { title: 'abc' });
});*/


/*router
    .post('/login',function(req,res){
        var te = authentication(req,res);
      /!*  if(authentication(req,res)){
            res.cookie('sign','admin',{ expires: new Date(Date.now() + 900000), httpOnly: true });
            if(req.body.code!=undefined){
                res.cookie('weChatSign',true,{ expires: new Date(Date.now() + 900000), httpOnly: true });
            }
            res.json({success:true})
        }else{
            res.json({success:false,'err':'密码错误'});
        }*!/
    })
    .get('/login', function(req,res){
        res.sendFile(path.join(__dirname,'../views/webApp/index.html'))
    });

router.get('/logout', function(req,res){
    if(req.session.weChat==undefined){
        req.session.destroy();
        res.redirect('/');
    }else{
        res.redirect('/login');
    }
});*/


/*router.post('/UserInfo',function(req,res){

    var cmd = "SELECT * FROM student WHERE sid='" + req.session.account +"'";
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        connection.query(cmd,function(err, rows, fields) {
            connection.release();
            if (err){
                throw err;
            }
            if(rows.length==1)
            {
                var data = rows[0];
                data.politicalStatus = req.session.politicalStatus;
                data.nickname = req.session.nickname;
                /!*raws[0].
                req.session.account =  req.body.account;
                res.cookie('sign','admin',{ expires: new Date(Date.now() + 900000), httpOnly: true });
                if(req.body.code!=undefined){
                    res.cookie('weChatSign',true,{ expires: new Date(Date.now() + 900000), httpOnly: true });
                }*!/
                res.json(data)
            }else{
                res.json({success:false,'err':'密码错误或用户不存在'});
            }
        });
    });
});*/



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //var dirpath = path.join(config.uploadPath)
        //config.mkdir(dirpath);
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({ storage: storage });
var pool = mysql.createPool(config.mysql);
/*var cmd =
    "SELECT password FROM User WHERE username='admin'";
pool.getConnection(function(err, connection) {
    console.log('getConnection');
    connection.query(cmd,function(err, rows) {
        console.log('query');
    });
});*/

require('../controller/UserController.js')(router,pool,upload);
require('../controller/SiteController.js')(router);
require('../controller/weChatController.js')(router,pool);

/*router.post('/upload', upload.single('file'), function (req, res, next) {
    // req.body contains the text fields
    var cmd ="update User set photo= CONCAT(photo,'"+req.file.filename+
        ",')  where username ='"+ req.session.account+"'";
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        connection.query(cmd, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err;
                res.status(500).end()
            }else{
                res.status(200).end();
            }
        });
    });
    res.jsonp({a:'11',b:'test'});
})*/

/*router.post('/getImg', function (req, res, next) {
    var cmd = "SELECT * FROM User WHERE username='" + req.session.account +"'";
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        connection.query(cmd, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err;
            }
            if (rows.length == 1) {
                var data = {};
                data.photo　= rows[0].photo;
                res.json(data)
            } else {
                res.json({success: false, 'err': 'getimg'});
            }
        });
    });
});*/
/*router.post('/delImg', function(req,res,next){
    var cmd ="update User set photo= REPLACE(photo,'"+
        req.body.filename + ",','' )  where username ='"+ req.session.account + "'";
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        connection.query(cmd, function (err, rows, fields) {
            connection.release();
            if (err) {
                res.status(500).end();
                throw err;
            }else{
                /!*var filePath = path.join(config.uploadPath,req.body.filename);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath);
                }*!/
                res.status(200).end();
            }
        });
    });
});*/

/*router.post('/upload',multer({dest: './uploads/'}).single('file'), function(req, res) {
    try {
        console.log(req.body.file);
        console.log(req.files);
        res.json(200);
    } catch (e) {
        console.log(e);
    }
});*/

/*router.get('/login.html', function(req, res,next) {
    res.sendFile(path.join(__dirname,'../views/webApp/login.html'))
});
router.get('/form.html', function(req, res,next) {
    res.sendFile(path.join(__dirname,'../views/webApp/form.html'));

    //res.sendFile(path.join(__dirname,'../views/webApp/authFalse.html'))
});
router.get('/sidebar.html', function(req, res,next) {
    res.sendFile(path.join(__dirname,'../views/webApp/sidebar.html'))
});

router.get('/userlogo.html', function(req, res,next) {
    res.sendFile(path.join(__dirname,'../views/webApp/userlogo.html'))
    //res.redirect('/home');
    //res.sendFile(path.join(__dirname,'../views/webApp/authFalse.html'))
});

router.get('/test.html', function(req, res,next) {
    res.sendFile(path.join(__dirname,'../views/webApp/test.html'))
    //res.redirect('/home');
    //res.sendFile(path.join(__dirname,'../views/webApp/authFalse.html'))
});*/


/*var authentication = function(req, res) {
    var cmd = "SELECT * FROM User WHERE username='" + req.body.account +"'";
     pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        connection.query(cmd,function(err, rows, fields) {
            connection.release();
            if (err){
                throw err;
            }
            if(rows.length==1 &&bcrypt.compareSync(req.body.password,rows[0].password))
            {
                req.session.account =  req.body.account;
                req.session.nickname =  rows[0].nickname;
                req.session.politicalStatus = rows[0].politicalStatus;
                req.session.photo = rows[0].photo;
                if(req.body.code!=undefined){
                    req.session.weChat = true;
                }
                res.json({success:true})
            }else{
                res.json({success:false,'err':'密码错误或用户不存在'});
            }
        });
    });
}*/

module.exports = router;
