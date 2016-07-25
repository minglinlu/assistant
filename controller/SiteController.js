var path=require('path');

SiteController = function(app){
/**---------------public-------------------------------------------**/
    /*//判断跳转
     if(req.session.account==undefined){
     if(req.session.openid!=undefined)
     res.redirect('/wechat');
     else
     res.redirect('/login');
     }else{
     res.sendFile(path.join(__dirname,'../views/webApp/index2.html'))
     }*/
    app.get('/',function(req,res){
        if(req.session.account!=undefined){
            if(req.session.role == 'ROLE_STUDENT'){
                res.redirect('/student');
            }else if(req.session.role == 'ROLE_TEACHER'){
                res.redirect('/teacher');
            }else if(req.session.role == 'ROLE_ADMIN'){
                res.redirect('/admin');
            }else{
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
        }
    });

    app.get('/login', function(req,res){
        res.sendFile(path.join(__dirname,'../views/webApp/index.html'));
    });

    app.get('/login.html', function(req, res) {
        res.sendFile(path.join(__dirname,'../views/webApp/login.html'));
    });


    app.get('/alertBar', function(req, res) {
        res.render('./template/alertBar')
    });

    app.get('/test.html', function(req, res) {
        res.render('./weChat/rg-index',{'base':'/wechat/'});
    });
    app.get('/wechat/register',function(req,res){
        res.render('./weChat/register');
    });
    app.get('/wechat/rg-success',function(req,res){
        res.render('./weChat/rg-success');
    });

/**---------------public-------------------------------------------**/

/**---------------student-------------------------------------------**/
     app.get('/student',function(req, res){
        //判断跳转
        /*if(req.session.account==undefined){
            if(req.session.openid!=undefined)
                res.redirect('/wechat');
            else
                res.redirect('/login');
        }else{
            res.sendFile(path.join(__dirname,'../views/webApp/index2.html'))
        }*/
         if(req.session.account!=undefined &&
            req.session.role == 'ROLE_STUDENT'){
             res.sendFile(path.join(__dirname,'../views/webApp/index2.html'));
         }else{
             res.redirect('/');
         }
    });

    app.get('/student/*',function(req,res,next){
        //用于验证
        next();
    });


    app.get('/student/form.html', function(req, res) {
        res.sendFile(path.join(__dirname,'../views/webApp/form.html'));
    });

    app.get('/student/sidebar.html', function(req, res) {
        res.sendFile(path.join(__dirname,'../views/webApp/sidebar.html'));
    });

    app.get('/student/userlogo.html', function(req, res) {
        res.sendFile(path.join(__dirname,'../views/webApp/userlogo.html'));
    });

    app.get('/student/changepwd', function(req, res){
        res.render('./webApp/changepwd',{'test':'abc'});
    });
    app.get('/student/schedule',function(req,res){
        res.render('./webApp/schedule');
    });
    app.get('/student/leave',function(req,res){
        res.render('./webApp/leave');
    });
    app.get('/student/leaveAsk',function(req,res){
        res.render('./webApp/leaveAsk');
    });
/**---------------student-------------------------------------------**/

/**---------------teacher-------------------------------------------**/
    app.get('/teacher', function(req, res){
        res.render('./teacher/index',{'base':'/teacher/'});
    });

    app.get('/teacher/userInfo', function(req, res){
        res.render('./teacher/userInfo');
    });

    app.get('/teacher/sidebar', function(req, res){
        res.render('./teacher/sidebar');
    });

    app.get('/teacher/changepwd', function(req, res) {
        res.render('./teacher/changepwd');
    });

    app.get('/teacher/studentManage', function(req, res) {
        res.render('./teacher/studentManage');
    });

    app.get('/teacher/studentDetail', function(req, res) {
        res.render('./teacher/studentDetail');
    });

    app.get('/teacher/editDetail', function(req, res) {
        res.render('./teacher/editDetail');
    });

    app.get('/teacher/studentLogo', function(req, res) {
        res.render('./teacher/studentLogo');
    });
    app.get('/teacher/classManage', function(req, res) {
        res.render('./teacher/classManage');
    });

    app.get('/teacher/leaveManage', function(req, res) {
        res.render('./teacher/leaveManage');
    });

    app.get('/teacher/leaveEdit', function(req, res) {
        res.render('./teacher/leaveEdit');
    });

/**---------------teacher-------------------------------------------**/

/**---------------Admin-------------------------------------------**/
app.get('/admin',function(req,res){
    res.json({teacher:'admin测试页面'})
});

/**---------------Admin-------------------------------------------**/



}

module.exports = SiteController;