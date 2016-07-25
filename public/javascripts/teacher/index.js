var app = angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
    'UserInfo',
    'changePassword',
    'studentManage',
    'studentDetail',
    'classManage',
    'leaveManage',
    'utils'
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
        .when('/',{templateUrl: 'userInfo',controller:'UserInfo',reloadOnSearch: false})
        .when('/changepwd',    {templateUrl: 'changepwd',controller:'changePwd',reloadOnSearch: false})
        .when('/studentManage',{templateUrl: 'studentManage',controller:'studentManage',reloadOnSearch: false})
        .when('/studentDetail:par',{templateUrl: 'studentDetail',controller:'studentDetail',reloadOnSearch: false})
        .when('/editDetail:par',{templateUrl: 'editDetail',controller:'editDetail',reloadOnSearch: false})
        .when('/studentLogo:par',{templateUrl: 'studentLogo',controller:'studentLogo',reloadOnSearch: false})
        .when('/classManage',{templateUrl: 'classManage',controller:'classManage',reloadOnSearch: false})
        .when('/leaveManage',{templateUrl: 'leaveManage',controller:'leaveManage',reloadOnSearch: false})
        .when('/leaveEdit:par',{templateUrl: 'leaveEdit',controller:'leaveEdit',reloadOnSearch: false})
        .when('/changeSuccess',{redirectTo:'/changepwd'})
        .otherwise({redirectTo:'/'})
});
app.controller('MainController',['$rootScope','$scope','TipService',
    function($rootScope, $scope,TipService){
        $scope.tipService = TipService;
        $rootScope.$on('$routeChangeStart', function(){
            $rootScope.loading = true;
        });

        $rootScope.$on('$routeChangeSuccess', function(){
            $rootScope.loading = false;
        });
}]);



