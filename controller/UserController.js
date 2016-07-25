var path=require('path');
var bcrypt = require('bcrypt-nodejs');

UserController = function(app, pool,upload ){
    app.post('/login',function(req,res){
        var cmd =
            "SELECT password,role FROM User WHERE username='" +
            req.body.account +"'";
        console.log(cmd);
        pool.getConnection(function(err,connection) {
            connection.query(cmd,function(err, rows) {
                if (err){
                    console.log('err1:'+err);
                /*&&bcrypt.compareSync(req.body.password,rows[0].password)*/
                }else if(rows.length==1&&bcrypt.compareSync(req.body.password,rows[0].password)){
                    console.log('err2:');
                    req.session.account =  req.body.account;
                    req.session.role = rows[0].role;
                    if(req.session.openid !=undefined){
                        var saveopenid = "UPDATE User  SET weixinId = '" +
                            req.session.openid + "' WHERE username = '" +
                            req.session.account + "'";
                        console.log(saveopenid);
                        pool.getConnection(function(err, connection) {
                            connection.query(saveopenid,function(err, rows) {
                                if(err){
                                    res.json({success:false,'err':'绑定出错'});
                                }else{
                                    res.json({success:true})
                                }

                            });
                        });
                    }else{
                        res.json({success:true})
                    }

                }else{
                    res.json({success:false,'err':'密码错误或用户不存在'});
                }
            });
            connection.release();
        });
    });

    app.get('/logout', function(req,res){
        if(req.session.openid==undefined){
            req.session.destroy();
            res.redirect('/');
        }else{
            res.redirect('/login');
        }
    });

    app.post('/UserInfo',function(req,res){

        var cmd = "SELECT User.politicalStatus,User.nickname,student.* FROM student INNER JOIN User WHERE " +
            "User.username = student.sid AND sid='" +
            req.session.account +"'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    throw err;
                }
                if(rows.length==1)
                {
                    var data = rows[0];
                    res.json(data)
                }else{
                    res.json({success:false,'err':'查询错误'});
                }
            });
        });
    });

    app.post('/SaveUserInfo',function(req,res){
        var cmd = "UPDATE User INNER JOIN student ON User.username=student.sid SET " +
            "nickname='" + req.body.nickname +
            "',politicalStatus='" + req.body.politicalStatus +
            "',grade='" + req.body.grade +
            "',student.from='"  + req.body.from  +
            "',dormitory='" + req.body.dormitory +
            "',post='"  + req.body.post +
            "',specialty='" + req.body.specialty +
            "',financial='" + req.body.financial +
            "',student.comment='"   + req.body.comment +
            "' WHERE sid='" + req.session.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    throw err;
                }else{
                    res.redirect('/');
                }
            });
        });

    });

    app.post('/upload', upload.single('file'), function (req, res) {
        var cmd ="update User set photo= CONCAT_WS('',photo,'"+req.file.filename+
            ",')  where username ='"+ req.session.account+"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    throw err;
                    res.status(500).end()
                }else{
                    res.status(200).end();
                }
            });
        });
    });

    app.post('/getImg', function (req, res) {
        var cmd = "SELECT * FROM User WHERE username='" + req.session.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err, rows) {
                connection.release();
                if (err) {
                    throw err;
                }
                else if (rows.length == 1)
                {
                    var data = {};
                    data.photo　= rows[0].photo;
                    res.json(data);
                } else {
                    res.json({success: false, 'err': 'getimg'});
                }
            });
        });
    });

    app.post('/delImg', function(req,res){
        var cmd ="update User set photo= REPLACE(photo,'"+
            req.body.filename + ",','' )  where username ='"
            + req.session.account + "'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    res.status(500).end();
                    throw err;
                }else{
                    res.status(200).end();
                }
            });
        });
    });

    app.post('/changepwd', function(req,res){
        var cmd =
            "SELECT password FROM User WHERE username='" +
            req.session.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    throw err;
                }else if(rows.length==1&&bcrypt.compareSync(req.body.password,rows[0].password)){
                        var saveopenid = "UPDATE User  SET password = '" +
                            bcrypt.hashSync(req.body.newPassword) + "' WHERE username = '" +
                            req.session.account + "'";
                        pool.getConnection(function(err, connection) {
                            connection.query(saveopenid,function(err) {
                                connection.release();
                                if(err){
                                    res.json({success:false,'err':'未知错误'});
                                }else{
                                    res.json({success:true,'msg':'密码修改成功'});
                                }

                            });
                        });

                }else{
                    res.json({success:false,'err':'原始密码错误'});
                }
            });
        });
    });

    app.post('/saveSchedule',function(req,res){
        var cmd = "UPDATE student SET " +
            "curriculum='" + req.body.curriculum +
            "' WHERE sid='" + req.session.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    throw err;
                }else{
                    res.json({success: true, 'msg': '保存成功'})
                }
            });
        });

    });

    app.post('/leaveInfo',function(req,res){
        var cmd = "SELECT * FROM askForLeave WHERE sid='"+
            req.session.account +"'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    throw err;
                }else{
                    res.json(rows);
                }
            });
        });
    });

    app.post('/createLeave',function(req,res){
        var date = parseInt(new Date().valueOf()/1000);
        var cmd = "INSERT INTO askForLeave (sid,createdTIme,leaveTime,leaveReason) VALUES('" +
            req.session.account+"','" +
            date + "','" +
            req.body.leaveTime +"','"+
            req.body.leaveReason + "')";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    res.json({success:false,'err':'未知错误'})
                }else{
                    res.json({success: true, 'msg': '保存成功'})
                }
            });
        });

    });
//UPDATE askForLeave SET leaveTime = '{"from":1466042761,"to":1466042760}' WHERE `askForLeave`.`id` = 18;
    app.post('/updateLeave',function(req,res){
        var date = parseInt(new Date().valueOf()/1000);
        var cmd = "UPDATE askForLeave SET leaveTime ='" +
                req.body.leaveTime +
                "',leaveReason='" + req.body.leaveReason +
                "' WHERE submitResult='0'&&id='" + req.body.id +
                "'&&sid='" + req.session.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err,rows) {
                connection.release();
                if (err) {
                    res.json({success:false,'err':'未知错误'})
                }else if(rows.affectedRows==0){
                    res.json({success: false, 'msg': '修改失败'});
                }else{
                    res.json({success: true, 'msg': '修改成功'})
                }
            });
        });

    });

    app.post('/delLeave', function(req,res){
        var cmd ="DELETE FROM askForLeave WHERE submitResult='0' && id='"+
                req.body.id + "'&&sid='" +
            req.session.account + "'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd, function (err,rows) {
                connection.release();
                if (err) {
                    res.json({success:false,'err':'未知错误'});
                }else if(rows.affectedRows==0){
                    res.json({success: false, 'msg': '删除失败'});
                }else{
                    res.json({success: true, 'msg': '删除成功'});
                }
            });
        });
    });

/**---------------teacher-------------------------------------------**/
    app.post('/teacher/*',function(req,res,next){
        console.log('验证');
        next();
    });
    app.post('/teacher/userInfo',function(req,res){
        var cmd = "SELECT nickname,address,birthdate,email,qq,telephone,sex,politicalStatus,nation " +
            "FROM User WHERE role='ROLE_TEACHER'&&username='" +
            req.session.account +"'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }
                if(rows.length==1)
                {
                    var data = rows[0];
                    res.json(data)
                }else{
                    res.json({success:false,'err':'查询错误'});
                }
            });
        });
    });

    app.post('/teacher/saveUserInfo',function(req,res){
        var cmd = "UPDATE User  SET " +
                "nickname='" + req.body.nickname +
                "',address='" + req.body.address +
                "',email='" + req.body.email +
                "',qq='" + req.body.qq +
                "',sex='" + req.body.sex +
                "',nation='"+ req.body.nation +
                "',telephone='" + req.body.telephone +
                "',birthdate='" + req.body.birthdate +
                "',politicalStatus='" + req.body.politicalStatus +
                "' WHERE role='ROLE_TEACHER'&&username='" + req.session.account +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err,rows) {
                connection.release();
                if (err) {
                    res.json({success:false});
                }else if(rows.affectedRows == 0) {
                    res.json({success:false});
                }else{
                    res.json({success:true});
                }
            });
        });

    });

    app.post('/teacher/studentInfo',function(req,res){
        var cmd = "SELECT student.sid,student.class,User.nickname,student.organizationId FROM student JOIN User ON student.sid=User.username " +
            "WHERE student.organizationId = any(SELECT  id FROM `Organization` " +
            "WHERE depth='3'&&counselor='" +
            req.session.account+ "') "
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }else{
                    var data = rows;
                    res.json(data);
                }
            });
        });
    });
    /*SELECT * from (SELECT * FROM student JOIN User ON student.sid=User.username WHERE student.organizationId = any(SELECT id FROM `Organization`WHERE depth='3'&&counselor='gfhuang')) AS a WHERE a.sid = '201430810010'*/
    app.post('/teacher/studentDetail',function(req,res){
        var cmd = "SELECT  sid,nickname,User.politicalStatus,grade,department,'from',dormitory," +
            "post,evaluation,specialty,financial,'comment' from student JOIN User ON student.sid=User.username" +
            " WHERE sid = '" + req.body.sid +
            "' && class='" + req.body.class +
            "' && organizationId='" + req.body.organizationId +
            "'"
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }else if(rows.length==1){
                   res.json(rows[0]);
                }else{
                    res.json({success:false,'err':'查询错误'});
                }
            });
        });
    });

    app.post('/teacher/saveStudentInfo',function(req,res){
        var cmd = "UPDATE User INNER JOIN student ON User.username=student.sid SET " +
            "nickname='" + req.body.nickname +
            "',politicalStatus='" + req.body.politicalStatus +
            "',grade='" + req.body.grade +
            "',department='" + req.body.department +
            "',student.from='"  + req.body.from  +
            "',dormitory='" + req.body.dormitory +
            "',post='"  + req.body.post +
            "',evaluation='" + req.body.evaluation +
            "',specialty='" + req.body.specialty +
            "',financial='" + req.body.financial +
            "',student.comment='"   + req.body.comment +
            "' WHERE sid='" + req.body.sid +
            "' && class='" + req.body.class +
            "' && organizationId='" + req.body.organizationId +
            "'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err,rows) {
                connection.release();
                if (err) {
                    res.json({success:false});
                }else if(rows.affectedRows==0){
                    res.json({success:false});
                }else{
                    res.json({success:true});
                }
            });
        });

    });


    app.post('/teacher/getImg', function (req, res) {
        var cmd = "SELECT * FROM User WHERE username='" + req.body.sid +"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err, rows) {
                connection.release();
                if (err) {
                    throw err;
                }
                else if (rows.length == 1)
                {
                    var data = {};
                    data.photo　= rows[0].photo;
                    res.json(data);
                } else {
                    res.json({success: false, 'err': 'getimg'});
                }
            });
        });
    });

    app.post('/teacher/upload', upload.single('file'), function (req, res) {
        var cmd ="update User set photo= CONCAT_WS('',photo,'"+req.file.filename+
            ",')  where username ='"+ req.body.sid+"'";
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err,rows) {
                connection.release();
                if (err) {
                    throw err;
                    res.status(500).end()
                }else{
                    res.status(200).end();
                }
            });
        });
    });

    app.post('/teacher/delImg', function(req,res){
        var cmd ="update User set photo= REPLACE(photo,'"+
            req.body.filename + ",','' )  where username ='"
            + req.body.sid + "'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    res.status(500).end();
                    throw err;
                }else{
                    res.status(200).end();
                }
            });
        });
    });

    app.post('/teacher/getDepartment',function(req,res){
        var cmd = "SELECT * FROM Organization WHERE parentId= (SELECT collegeId FROM teacher " +
            "WHERE id = '" + req.session.account + "' )";
        pool.getConnection(function(err, connection) {
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }else{
                    res.json(rows);
                }
            });
        });
    });

    app.post('/teacher/getClass',function(req,res){
        var cmd = "SELECT id,name,counselor FROM Organization WHERE  parentId='" +
            req.body.id + "'";
        var userCmd = "SELECT username,nickname FROM User WHERE username = " +
            "any(SELECT counselor as a FROM `Organization`WHERE  parentId='" +
            req.body.id +"')";
        pool.getConnection(function(err, connection) {
            connection.query(cmd,function(err, rows) {
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }else{
                    connection.query(userCmd,function(e, r) {
                        connection.release();
                        if (e){
                            res.json({success:false,'err':'查询错误'});
                        }else{
                            res.json({user:r,items:rows,self:req.session.account});
                        }
                    });
                }
            });
        });
    });
    /*SELECT username,nickname FROM User WHERE username = any(SELECT counselor as a FROM `Organization`WHERE  parentId='1459')*/
    app.post('/teacher/manageClass',function(req,res){
        var cmd;
        if(req.body.toggle=='true'){
            cmd = "UPDATE  Organization SET counselor='' " +
                " WHERE id='" + + req.body.id +
                "'&&counselor = '" +req.session.account + "'";
        }else{
            cmd = "UPDATE  Organization SET " +
                "counselor='" + req.session.account +
                "'  WHERE id='" + req.body.id +
                "'&&(counselor IS null || counselor = '')";
        }
        pool.getConnection(function(err, connection) {
            connection.query(cmd, function (err,rows) {
                connection.release();
                if (err) {
                    res.json({success:false});
                }else if(rows.affectedRows==0){
                    res.json({success:false});
                }else{
                    res.json({success:true});
                }
            });
        });

    });

    app.post('/teacher/leaveInfo',function(req,res){
        var cmd = "SELECT askForLeave.*, User.nickname,student.class,student.department " +
            "from (askForLeave  JOIN User  ON askForLeave.sid=User.username) " +
            "JOIN student ON askForLeave.sid= student.sid WHERE askForLeave.sid = " +
            "any(SELECT sid FROM student WHERE organizationId = " +
            "any(SELECT  id FROM `Organization` WHERE depth='3'&&counselor='" +
            req.session.account+"'))";
        pool.getConnection(function(err, connection) {
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }else{
                    res.json(rows);
                }
            });
        });
    });

    app.post('/teacher/saveLeave',function(req,res){
        var cmd = "UPDATE askForLeave SET" +
            " submitResult='" + req.body.submitResult +
            "',submitRemark='" + req.body.submitRemark +
            "' WHERE id = " + req.body.id;
        pool.getConnection(function(err, connection) {
            connection.query(cmd,function(err, rows) {
                connection.release();
                if (err){
                    res.json({success:false,'err':'查询错误'});
                }else if(rows.affectedRows == 0){
                    res.json({success:false,'err':'查询错误'});
                }else{
                    res.json({success:true})
                }
            });
        });
    });



/**---------------teacher-------------------------------------------**/

}

module.exports = UserController;