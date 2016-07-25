/**
 * Created by zheor on 16-4-13.
 */

var uploader;


var app = angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
    'changePassword',
    'schedule',
    'leave',
    // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
    // it is at a very beginning stage, so please be careful if you like to use
    // in production. This is intended to provide a flexible, integrated and and
    // easy to use alternative to other 3rd party libs like hammer.js, with the
    // final pourpose to integrate gestures into default ui interactions like
    // opening sidebars, turning switches on/off ..
    'mobile-angular-ui.gestures'
],function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

app.config(function($routeProvider) {
    $routeProvider.when('/',    {templateUrl: 'form.html',controller:'UserInfo',reloadOnSearch: false})
        .when('/logo',    {templateUrl: 'UserLogo.html',controller:'UserLogo',reloadOnSearch: false})
        .when('/changepwd',    {templateUrl: 'changepwd',controller:'changePwd',reloadOnSearch: false})
        .when('/schedule', {templateUrl:'schedule',controller:'schedule',reloadOnSearch: false})
        .when('/leave',{templateUrl:'leave',controller:'leave',reloadOnSearch: false})
        .when('/leave/ask',{templateUrl:'leaveAsk',controller:'leaveAsk',reloadOnSearch: false})
        .when('/leave/edit:par',{templateUrl:'leaveAsk',controller:'leaveEdit',reloadOnSearch: false})
        .when('/toSchedule',{redirectTo:'/schedule'})
        .when('/delLeave',{redirectTo:'/leave'})
        .otherwise({redirectTo: '/'});
/*    $routeProvider.when('/logo',    {templateUrl: 'form.html',reloadOnSearch: false});*/


});

app.controller('UserInfo', function ($scope,$http) {

    $scope.getUserInfo = function(){
        var url ='/UserInfo';
        var token={
            token:'token'
        };
        $http.post(url,token).
        success(function(data, status, headers, config){
            /* $scope.UserInfo=data;
             location.hash='/home';
             console.log("success!");*/
            $scope.UserInfo = data;
            $scope.UserInfo.curriculum = JSON.parse($scope.UserInfo.curriculum);

        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("error");
        });
    }();
});

app.controller('UserLogo',function($rootScope,$scope,$http){
    $scope.getImg = function (){
        var url='/getImg'
        $http.post(url).
        success(function(data, status, headers, config){
            var urlArray = data.photo.split(',');
            if(urlArray.length!=0){
                $scope.photos = urlArray.slice(0,urlArray.length-1);
            }else{
                $scope.photos = urlArray;
            }
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("error");
        });
    }

    $scope.delImg = function(photoname){
        var url ='/delImg';
        $http.post(url,{filename:photoname}).
        success(function(data, status, headers, config){
            $scope.getImg();
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("error");
        });
    }



    $scope.getImg();
    uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        fileSizeLimit:2*1024*1024,
        // swf文件路径
        swf: 'javascripts/webuploader/Uploader.swf',
        method:'POST',

        // 文件接收服务端。
        server:'/upload',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    uploader.on( 'uploadError', function(err) {
        $rootScope.showMsg(err);
    });

    uploader.on('error', function(type){
        switch(type) {
            case "Q_EXCEED_SIZE_LIMIT":
                $rootScope.showMsg('文件过大，请上传较小的文件！');
                break;
            case "Q_EXCEED_NUM_LIMIT":
                $rootScope.showMsg('添加的文件数量过多！');
                break;
            case "Q_TYPE_DENIED":
                $rootScope.showMsg('文件类型错误！');
                break;
        }
    });
    uploader.on('uploadSuccess',function(file,res){
        uploader.reset();
        $("#pic").empty();
        $scope.getImg();
    });
});


app.controller('MainController',function($rootScope, $scope,$http,TipService){
    $scope.tipService = TipService;
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        $rootScope.loading = false;
    });

 /*   // Fake text i used here and there.
    $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

    //
    // 'Scroll' screen
    //
    var scrollItems = [];

    for (var i=1; i<=100; i++) {
        scrollItems.push('Item ' + i);
    }

    $scope.scrollItems = scrollItems;

    $scope.bottomReached = function() {
        alert('Congrats you scrolled to the end of the list!');
    }


    //
    // 'Drag' screen
    //
/*    $scope.notices = [];

    for (var j = 0; j <12; j++) {
        $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1) });
    }

    $scope.deleteNotice = function(notice) {
        var index = $scope.notices.indexOf(notice);
        if (index > -1) {
            $scope.notices.splice(index, 1);
        }
    };*/

    $rootScope.notice={msg:'',show:false,type:'alert-info'}
    $rootScope.showMsg = function(msg,leave){

        if(leave=='danger'){
            $rootScope.notice.type = 'alert-danger';
        }else if(leave == 'warning'){
            $rootscope.notice.type = 'alert-warning';
        }
        if(msg == undefined){
            $rootScope.notice.show=false;
        }else{
            $rootScope.notice.msg=msg;
            $rootScope.notice.show=true;
           /* $scope.$apply();*/
        }

    }


});


