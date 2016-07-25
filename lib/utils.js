
utils = {
    saveID:function(req,res,pool){
        var cmd ="update User set weixinId= '"+req.body.wechatID+
            "' WHERE username='"+ req.body.account +"'";
        pool.getConnection(function(err, connection) {
            // connected! (unless `err` is set)
            connection.query(cmd, function (err) {
                connection.release();
                if (err) {
                    res.json({success:false,'err':'未知错误'});
                }else{
                    res.json({success:true,'msg':'绑定成功'});
                }
            });
        });
    },
}

module.exports = utils