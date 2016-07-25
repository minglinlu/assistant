var path=require('path');
var bcrypt = require('bcrypt-nodejs');
var utils = require('../lib/utils')
var OAuth = require('wechat-oauth');
var API = require('wechat-enterprise').API;
const corpid='wx3348d8d51353fb39';
const corpsecret='74wx3s8E6LHBYYbxS6mj_QMlzlBncTM-fej0R8YqeHK5PerhCaRYks7_6V28Q5Hw';
var api = new API(corpid,corpsecret);
/*var uInfo = {
    "userid": 'test11',
    "name": 'test',
    "department": 1,
    "weixinid": 'zzd550510593'
};
api.createUser(uInfo,function(e,d){
   console.log(d);
});*/

var client = new OAuth('wx1ebe3a0fcfc109c5', '42d92643b890758a89b8c08fbe6bf428');
var url = client.getAuthorizeURL('http://test.any-edu.com/login', 'STATE', 'snsapi_userinfo');
 console.log(url);

weChatController = function(app,pool){
    app.get('/wechatRedirect',function(req,res){
        if(req.session.openid==undefined){
            res.redirect(url);
        }else{
            res.redirect('/');
        }
    });
    app.get('/weChat',function(req,res){
        if(req.query.code != undefined)
        {
            client.getAccessToken(req.query.code,function(err,result){
                if(err){
                    throw(err);
                }else{
                    req.session.accessToken = result.data.access_token;
                    req.session.openid = result.data.openid;
                    res.sendFile(path.join(__dirname,'../views/weChat/index.html'));
                }
            });
        }else if(req.session.openid !=undefined){
            res.sendFile(path.join(__dirname,'../views/weChat/index.html'));
        } else{
            res.status(404).end();
        }
    });
    app.get('/weChatLogin.html',function(req, res){
            //res.render('./weChat/ErrClient');
            res.render('./weChat/login');
    });

    app.post('/register',function(req,res){
        var cmd =
            "SELECT password,weixinId FROM User WHERE username='" +
            req.body.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    throw err;
                }else if(rows.length==1&&bcrypt.compareSync(req.body.password,rows[0].password)){
                    if(rows[0].weixinId==null||rows[0].weixinId==''){
                        var userInfo    = {
                            "userid": req.body.account,
                            "name": req.body.account,
                            "department": 1,
                            "weixinid": req.body.wechatID
                        };
                        api.createUser(userInfo,function(err, result){
                            if(!err){
                                utils.saveID(req,res,pool);
                            }else if(err.code=='60102'){
                                var upUser ={
                                    "userid":req.body.account,
                                    "weixinid": req.body.wechatID
                                };
                                api.updateUser(upUser,function(e,r){
                                   if(e){
                                       res.json({success:false,'err':'未知错误'});
                                   } else{
                                       utils.saveID(req,res,pool);
                                   }
                                });
                            }else if(err.code=='60108') {
                                res.json({success:false,'err':'已经绑定微信或该微信号已经绑定其他账号'});
                            }else{
                                res.json({success:false,'err':'未知错误'});
                            }
                        });
                    }else{
                        res.json({success:false,'err':'已经绑定微信或该微信号已经绑定其他账号'});
                    }
                }else{
                    res.json({success:false,'err':'密码错误'});
                }
            });
        });
    });
}

module.exports = weChatController;