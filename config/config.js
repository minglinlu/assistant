var path=require('path');
var fs=require('fs');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = {
    uploadPath:'/home/zheor/WebstormProjects/login/uploads',//上传地址
    mysql:{
        host : 'localhost',
        user : 'root',
        password : '123456',
        database : 'nodejstest'
    },
    port:'3000',
    sessionConfig:{
        cookie: { maxAge: 2592000000 },
        secret: 'sessionsecret123456',
        store: new RedisStore({
            host:'127.0.0.1',
            port:'6379',
            db:1
        })
    }
};

/*module.exports = {
    uploadPath:'/var/www/XGC/web/upload',//上传地址
    mysql:{
        host : 'localhost',
        user : 'root',
        password : 'cellcom',
        database : 'dbXGC'
    },
    port:'80',
    sessionConfig:{
        cookie: { maxAge: 2592000000 },
        secret: 'sessionsecret123456',
        store: new RedisStore({
            host:'127.0.0.1',
            port:'6379',
            db:1
        })
    }
};*/



var mkdir =  module.exports.mkdir=function(dirPath){
    if(!fs.existsSync(dirPath)){
        console.log('not')
        mkdir(path.dirname(dirPath));
        fs.mkdirSync(dirPath);
    }
}
