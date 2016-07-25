var app = angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    'weChatRegister'
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

    $routeProvider
        .when('/',    {templateUrl: 'register',controller:'weChatRg',reloadOnSearch: false})
        .when('/success',{templateUrl:'rg-success',reloadOnSearch: false})
        .otherwise({redirectTo: '/'});
    //$routeProvider.when('/home',    {templateUrl: 'form.html',reloadOnSearch: false});

});

app.controller('MainController',function($rootScope, $scope,$http){
    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;
    $scope.notice = {
        msg:'',
        show:false,
        type:'alert-info'
    }
    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        $rootScope.loading = false;
    });

    // Fake text i used here and there.
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

    $scope.login = function(user) {
        var url ='/login';
        //var wechat = ($location.search().code!=undefined);
        user.code= getQueryString('code');

        $http.post(url,user).
        success(function(data, status, headers, config){
            if(data.success===true){
                window.location.href='/';
            }else{
                $scope.showMsg(data.err);
            }

        }).
        error(function(data, status, headers, config) {
            console.log("error");
        });
    };


    $scope.showMsg = function(msg,leave){

        if(leave=='danger'){
            $scope.notice.type = 'alert-danger';
        }else if(leave == 'warning'){
            $scope.notice.type = 'alert-warning';
        }
        if(msg == undefined){
            $scope.notice.show=false;
        }else{
            $scope.notice.msg=msg;
            $scope.notice.show=true;
            /*$scope.$apply();*/
        }
    }
});



